const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const script=html.split('<script>')[1].split('</script>')[0];
const adapter=script.slice(script.indexOf("let personalKey="),script.indexOf('\nfunction show'));
function setup(options={}){
 const calls=[];
 const ctx=vm.createContext({setTimeout,clearTimeout,AbortController,fetch:async(url,opts)=>{
  const body=JSON.parse(opts.body);calls.push({url,body});
  const score=body.input.includes('how logical')?2:body.input.includes('change your beliefs')?5:4;
  return {ok:true,json:async()=>({status:options.incomplete?'incomplete':'completed',model:'mock-model',id:'mock-id',output:[{type:'reasoning',summary:[]},{type:'message',role:'assistant',content:[{type:'output_text',text:options.invalid?'Score: 4':String(score)}]}]})};
 }});
 vm.runInContext(adapter,ctx);
 return {calls,run:code=>vm.runInContext(code,ctx)};
}
const input="{company:'Fictional',topic:'markets',objective:'Goal',response:'Response',runs:1}";
test('complete script parses and latest wording is preserved',()=>{
 new vm.Script(script);
 assert(html.includes('How coherent are your strategic choices?'));
 assert(html.includes('Strategic Choice Observatory'));
 assert(!/sk-(?:proj-)?[A-Za-z0-9_-]{20,}/.test(html));
});
test('all categories use Responses API and requested settings; composite adds no calls',async()=>{
 const {calls,run}=setup();
 await run("api('/api/key',{key:'mock-key'})");
 await run(`globalThis.d=${input};globalThis.results=[];`);
 for(const category of ['alignment','logical','convincing'])await run(`api('/api/score',{...d,category:'${category}'}).then(r=>results.push(r))`);
 const composite=await run("api('/api/score',{...d,category:'composite',component_ids:results.map(r=>r.id)})");
 assert.equal(composite.score,3.75);assert.equal(composite.reasoning_score,3.5);assert.equal(calls.length,3);
 for(const {url,body} of calls){assert.equal(url,'https://api.openai.com/v1/responses');assert.equal(body.model,'gpt-5.6');assert.equal(body.reasoning.effort,'high');assert.equal(body.store,false);assert.equal(body.max_output_tokens,25000);assert(!('temperature' in body));}
 assert.equal(calls[0].body.input,'On a scale of 1-5 (using the entire scale), to what extent is the RESPONSE aligned with the OBJECTIVE?(1 = not at all aligned, 3 = somewhat aligned, 5 = very aligned).\n\nOBJECTIVE: Goal\n\nRESPONSE: Response');
 assert.equal((await run("api('/api/history')")).length,4);
 assert(run('portableCSV(portableHistory)').includes('component_ids'));
});
test('CSV aliases, quoted text, preview count and validation',async()=>{
 const {calls,run}=setup();
 const csv='companyid,topic,objective,q\r\nfictional,organization,goal,"A comma, and\na new line"\r\n';
 const rows=run(`parsePortableCSV(${JSON.stringify(csv)})`);
 assert.equal(rows[0].topic,'org');assert.equal(rows[0].response,'A comma, and\na new line');
 const preview=await run(`api('/api/preview',{csv:${JSON.stringify(csv)},categories:['alignment','logical','convincing','composite'],runs:5})`);
 assert.equal(preview.calls,15);assert.equal(preview.errors.length,0);assert.equal(calls.length,0);
 assert.throws(()=>run('parsePortableCSV("topic,response,response\\na,b,c")'));
 assert.throws(()=>run(`validatePortable({...${input},category:'alignment',objective:''})`));
 assert(run("portableCSV([{company:'=formula'}])").includes("'=formula"));
});
test('five-run mode averages all ratings',async()=>{
 const {calls,run}=setup();await run("api('/api/key',{key:'mock-key'})");
 const r=await run(`api('/api/score',{...${input},runs:5,category:'alignment'})`);
 assert.equal(r.scores.length,5);assert.equal(r.score,4);assert.equal(calls.length,5);
});
test('incomplete and malformed responses are not saved',async()=>{
 for(const option of [{incomplete:true},{invalid:true}]){
  const {run}=setup(option);await run("api('/api/key',{key:'mock-key'})");
  await assert.rejects(run(`api('/api/score',{...${input},category:'alignment'})`));
  assert.equal((await run("api('/api/history')")).length,0);
 }
});
test('composite rejects missing component records',async()=>{
 const {run}=setup();await assert.rejects(run(`api('/api/score',{...${input},category:'composite',component_ids:[]})`));
});
