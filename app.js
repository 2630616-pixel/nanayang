const LS_KEY = 'nanayang_todos_v1'
let todos = []
let filter = 'all'

const q = sel => document.querySelector(sel)
const qAll = sel => document.querySelectorAll(sel)

function load(){
  try{todos = JSON.parse(localStorage.getItem(LS_KEY))||[]}
  catch(e){todos=[]}
}

function save(){
  localStorage.setItem(LS_KEY, JSON.stringify(todos))
}

function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}

function addTodo(text){
  if(!text.trim()) return
  todos.unshift({id:uid(),text:text.trim(),completed:false})
  save(); render()
}

function toggle(id){
  const t = todos.find(x=>x.id===id); if(!t) return
  t.completed = !t.completed; save(); render()
}

function removeTodo(id){
  todos = todos.filter(x=>x.id!==id); save(); render()
}

function editTodo(id){
  const t = todos.find(x=>x.id===id); if(!t) return
  const newText = prompt('할 일을 수정하세요', t.text)
  if(newText===null) return
  t.text = newText.trim()||t.text; save(); render()
}

function clearCompleted(){
  todos = todos.filter(x=>!x.completed); save(); render()
}

function filtered(){
  if(filter==='all') return todos
  if(filter==='active') return todos.filter(x=>!x.completed)
  return todos.filter(x=>x.completed)
}

function render(){
  const list = q('#todo-list'); list.innerHTML=''
  for(const item of filtered()){
    const li = document.createElement('li'); li.className='todo'+(item.completed? ' completed':'')
    li.innerHTML = `
      <input type="checkbox" ${item.completed? 'checked':''} data-id="${item.id}">
      <div class="title">${escapeHtml(item.text)}</div>
      <button class="edit" data-id="${item.id}">수정</button>
      <button class="del" data-id="${item.id}">삭제</button>
    `
    list.appendChild(li)
  }

  q('#count').textContent = `${todos.filter(x=>!x.completed).length}개 남음`;
  qAll('.filter').forEach(btn=>btn.classList.toggle('active', btn.dataset.filter===filter))
}

function escapeHtml(str){
  return (str+'').replace(/[&<>"']/g, s=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"
  })[s])
}

function bind(){
  q('#add-btn').addEventListener('click', ()=>{ addTodo(q('#todo-input').value); q('#todo-input').value=''; })
  q('#todo-input').addEventListener('keydown', e=>{ if(e.key==='Enter'){ addTodo(e.target.value); e.target.value=''} })

  q('#todo-list').addEventListener('click', e=>{
    const id = e.target.dataset.id
    if(e.target.tagName==='INPUT') toggle(id)
    if(e.target.classList.contains('edit')) editTodo(id)
    if(e.target.classList.contains('del')) removeTodo(id)
  })

  q('#clear-completed').addEventListener('click', clearCompleted)

  qAll('.filter').forEach(btn=>btn.addEventListener('click', e=>{ filter = e.target.dataset.filter; render() }))
}

// init
load(); bind(); render();
