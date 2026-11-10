(function(){
'use strict';
const $=id=>document.getElementById(id), config=window.BRAINJOY_CONFIG||{};
let client,session,state,accountEpoch=0;
function clearAccountView(){
 accountEpoch++;state=null;
 ['teacherClasses','studentAssignments','pendingParents','linkedParents','linkedStudents','results','publishClass','answers','playTitle','accountId','parentCode','adminSummary','insights'].forEach(id=>$(id).replaceChildren());
 $('answers').onsubmit=null;$('player').hidden=true;$('adminTab').hidden=true;$('workspace').hidden=true;$('auth').hidden=false;$('signout').hidden=true;
 document.querySelectorAll('#workspace form').forEach(f=>f.reset());
 choose('student');
}
const say=text=>{$('notice').textContent=text;};
function text(tag,value){const e=document.createElement(tag);e.textContent=value;return e;}
function button(label,fn){const b=text('button',label);b.type='button';b.onclick=()=>run(fn,b);return b;}
async function run(fn,b){if(b)b.disabled=true;try{await fn();}catch(e){if(!e.stale)say(e.message||'That did not work. Please try again.');}finally{if(b)b.disabled=false;}}
async function rpc(name,args){const epoch=accountEpoch,owner=session?.user.id;const {data,error}=await client.rpc(name,args||{});if(epoch!==accountEpoch||owner!==session?.user.id)throw Object.assign(Error('Account changed.'),{stale:true});if(error)throw Error(error.message);return data;}
function csv(value){return '"'+String(value??'').replace(/"/g,'""')+'"';}
function choose(view){document.querySelectorAll('.view').forEach(x=>x.hidden=x.id!==view);document.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.view===view)));}
function list(host,rows,make,empty){host.replaceChildren();if(!rows.length){host.append(text('p',empty));return;}for(const row of rows)host.append(make(row));}
function row(label,meta){const r=text('div','');r.className='row';r.append(text('strong',label));if(meta){const m=text('div',meta);m.className='meta';r.append(m);}return r;}
async function refresh(){
 const epoch=accountEpoch,owner=session?.user.id;if(!owner)return;
 const next=await rpc('bj_dashboard');if(epoch!==accountEpoch||owner!==session?.user.id)return;state=next;
 $('accountId').textContent=session.user.id;$('adminTab').hidden=!state.admin;
 const owned=state.classes.filter(c=>c.owner);
 list($('teacherClasses'),owned,c=>{const r=row(c.title,'Private class code: '+c.join_code);r.append(button('Replace join code',async()=>{if(!confirm('Replace this class code? Existing members keep access. The old code will stop accepting new members.'))return;await rpc('bj_rotate_class_code',{p_id:c.id});await refresh();say('Class code replaced.');}));return r;},'No classes yet. Create your first class above.');
 $('publishClass').replaceChildren();for(const c of owned){const o=text('option',c.title);o.value=c.id;$('publishClass').append(o);}
 $('publish').querySelector('button').disabled=!owned.length;
 list($('studentAssignments'),state.assignments,a=>{const r=row(a.title,a.closed?'Closed':'Ready to practice');r.append(button('Open assignment',()=>openAssignment(a.id)));if(owned.some(c=>c.id===a.class_id))r.append(button(a.closed?'Reopen':'Close assignment',async()=>{await rpc('bj_close_assignment',{p_id:a.id,p_closed:!a.closed});await refresh();}));return r;},'No assignments yet. Join your class using your teacher\'s code.');
 list($('pendingParents'),state.pending_parents||[],id=>{const r=row('Parent account: '+id,'Check this exact ID with your parent outside BrainJoy before approving. Approval shares your submitted quiz scores.');r.append(button('Approve this parent',async()=>{if(!confirm('I checked this account with my parent. Share my submitted quiz scores with this account?'))return;await rpc('bj_approve_parent',{p_parent:id});say('Parent access approved. You can remove it below.');await refresh();}));r.append(button('Reject request',async()=>{await rpc('bj_reject_parent',{p_parent:id});await refresh();}));return r;},'No pending requests.');
 list($('linkedParents'),state.linked_parents||[],id=>{const r=row(id);r.append(button('Remove access',async()=>{await rpc('bj_unlink_parent',{p_parent:id});say('Parent access removed. Previously exported copies cannot be recalled.');await refresh();}));return r;},'No parents have access.');
 list($('linkedStudents'),state.linked_students||[],id=>row(id),'No approved links. A code alone does not grant access.');
 $('results').replaceChildren();for(const r of state.results){const tr=document.createElement('tr');const a=state.assignments.find(a=>a.id===r.assignment_id);[a?.title||r.assignment_id,r.student_id,`${r.score} / ${r.total}`,new Date(r.submitted_at).toLocaleString()].forEach(v=>tr.append(text('td',v)));$('results').append(tr);}
 if(!state.results.length){const tr=document.createElement('tr'),td=text('td','No submitted results available.');td.colSpan=4;tr.append(td);$('results').append(tr);}
 drawInsights();
 $('workspace').hidden=false;$('auth').hidden=true;$('signout').hidden=false;
}
function drawInsights(){
 const host=$('insights');host.replaceChildren();const rows=state?.results||[];
 if(!rows.length){host.append(text('p','No submitted results yet. A new attempt will appear here after it is submitted.'));return;}
 const valid=rows.filter(r=>Number.isFinite(r.score)&&Number.isFinite(r.total)&&r.total>0&&r.score>=0&&r.score<=r.total);
 host.append(text('p',rows.length+' visible submission'+(rows.length===1?'':'s')+' across '+new Set(rows.map(r=>r.student_id)).size+' account'+(new Set(rows.map(r=>r.student_id)).size===1?'':'s')+'.'));
 if(!valid.length)return;
 const mean=Math.round(valid.reduce((sum,r)=>sum+100*r.score/r.total,0)/valid.length);host.append(text('p','Mean of visible quiz percentages: '+mean+'%. Each submission counts equally; quiz lengths may differ.'));
 const groups=new Map();for(const r of valid){if(!groups.has(r.assignment_id))groups.set(r.assignment_id,[]);groups.get(r.assignment_id).push(r);}
 for(const [id,attempts] of groups){const a=state.assignments.find(x=>x.id===id),pct=Math.round(attempts.reduce((sum,r)=>sum+100*r.score/r.total,0)/attempts.length),r=row(a?.title||'Shared assignment '+id,pct+'% average across '+attempts.length+' visible submission'+(attempts.length===1?'':'s'));const meter=document.createElement('meter');meter.min=0;meter.max=100;meter.value=pct;meter.setAttribute('aria-label',(a?.title||'Shared assignment')+' mean quiz percentage');meter.textContent=pct+'%';r.append(meter);host.append(r);}
}
async function openAssignment(id){
 const epoch=accountEpoch,owner=session?.user.id;if(!owner)return;
 const a=await rpc('bj_get_assignment',{p_id:id});if(epoch!==accountEpoch||owner!==session?.user.id)return;$('playTitle').textContent=a.title;const f=$('answers');f.replaceChildren();
 if(a.closed){f.append(text('p','This assignment is closed.'));$('player').hidden=false;return;}
 a.questions.forEach((q,i)=>{const group=document.createElement('fieldset');group.append(text('legend',`${i+1}. ${q.text}`));if(q.type==='short'){const input=document.createElement('input');input.name='answer-'+i;input.required=true;input.maxLength=500;input.setAttribute('aria-label','Answer for question '+(i+1));group.append(input);}else{const opts=q.type==='tf'?['True','False']:q.options;opts.forEach((v,n)=>{const l=document.createElement('label'),r=document.createElement('input');r.type='radio';r.name='answer-'+i;r.value=q.type==='tf'?String(n===0):String(n);r.required=true;l.append(r,document.createTextNode(v));group.append(l);});}f.append(group);});
 const submit=text('button','Submit answers');submit.className='primary';f.append(submit);f.onsubmit=e=>{e.preventDefault();run(async()=>{const d=new FormData(f);const answers=a.questions.map((q,i)=>q.type==='short'?d.get('answer-'+i):q.type==='tf'?d.get('answer-'+i)==='true':Number(d.get('answer-'+i)));const r=await rpc('bj_submit',{p_id:id,p_answers:answers});if(epoch!==accountEpoch||owner!==session?.user.id)return;f.replaceChildren(text('h3',`Your score: ${r.score} / ${r.total}`),text('p',r.already_submitted?'Your original submission is saved.':'Your answers are saved.'));await refresh();},submit);};
 $('player').hidden=false;$('player').scrollIntoView({behavior:'smooth'});
}
function form(id,fn){$(id).onsubmit=e=>{e.preventDefault();run(fn,$(id).querySelector('button'));};}
form('login',async()=>{const {data,error}=await client.auth.signInWithPassword({email:$('email').value.trim(),password:$('password').value});if(error)throw Error(error.message);$('password').value='';clearAccountView();session=data.session;await refresh();say('Signed in. Your view choice does not change account permissions.');});
form('createClass',async()=>{const r=await rpc('bj_create_class',{p_title:$('classTitle').value.trim()});$('classTitle').value='';await refresh();say('Class created. Share its private code only with intended class members: '+r.join_code);});
form('join',async()=>{await rpc('bj_join_class',{p_code:$('classcode').value.trim()});$('classcode').value='';await refresh();say('Class joined.');});
form('publish',async()=>{const file=$('quizFile').files[0];if(!file||file.size>1000000)throw Error('Choose a quiz JSON file smaller than 1 MB.');let q;try{q=JSON.parse(await file.text());}catch(_){throw Error('The file is not valid JSON.');}await rpc('bj_publish',{p_class:$('publishClass').value,p_title:q.title,p_questions:q.questions});await refresh();say('Assignment published. Its answer key is kept on the server.');});
form('linkParent',async()=>{await rpc('bj_link_parent',{p_code:$('linkCode').value.trim()});$('linkCode').value='';say('Request sent. Ask your child to check your account ID and approve this specific request. No results are shared yet.');});
$('loadAdmin').onclick=()=>run(async()=>{const r=await rpc('bj_admin_summary');$('adminSummary').textContent=Object.entries(r).map(([k,v])=>k.replaceAll('_',' ')+': '+v).join(' | ');},$('loadAdmin'));
$('makeParentCode').onclick=()=>run(async()=>{const code=await rpc('bj_parent_code');$('parentCode').textContent='Private code: '+code+'. Expires in 24 hours. Give it only to your intended parent. They will still need your approval.';},$('makeParentCode'));
$('cancelPlay').onclick=()=>{$('player').hidden=true;};
$('exportResults').onclick=()=>{if(!state||!session)return;const data=[['assignment_id','student_account','score','total','submitted_at'],...state.results.map(r=>[r.assignment_id,r.student_id,r.score,r.total,r.submitted_at])];const url=URL.createObjectURL(new Blob([data.map(r=>r.map(csv).join(',')).join('\r\n')],{type:'text/csv'}));const a=document.createElement('a');a.href=url;a.download='brainjoy-visible-results.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('signout').onclick=()=>run(async()=>{const {error}=await client.auth.signOut();if(error)throw Error(error.message);session=null;clearAccountView();say('Signed out.');});
$('views').onclick=e=>{const b=e.target.closest('[data-view]');if(b)choose(b.dataset.view);};
async function init(){
 if(!config.enabled){$('login').querySelectorAll('input,button').forEach(x=>x.disabled=true);say('Classroom cloud access is not open yet. We are testing account isolation and consent safeguards. Browser-only quiz practice remains available.');return;}
 if(!window.supabase)throw Error('Sign-in could not load. Check your connection and reload.');
 client=window.supabase.createClient(config.url,config.anonKey);const {data,error}=await client.auth.getSession();if(error)throw error;session=data.session;if(session)await refresh();const initialView=new URLSearchParams(location.search).get('view');if(['student','teacher','parent'].includes(initialView)||(initialView==='admin'&&state?.admin))choose(initialView);
 client.auth.onAuthStateChange((event,s)=>{if(!s||session?.user.id!==s?.user.id)clearAccountView();session=s;if(event==='SIGNED_OUT')say('Signed out.');});
}
run(init);
})();
