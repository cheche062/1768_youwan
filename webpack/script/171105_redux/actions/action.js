/*
 * action 类型
 */

// 添加代办事项
let count = 0;
export function addTodo(title) {
  return { type: "ADD_TODO", title, index: ++count, isDone: false }
}

// 代办事项完成与否的切换
export function toggleTodo(index) {
  return { type: "TOGGLE_TODO", index }
}

// 修改姓名
export function setName(val){
	return {type: "SET_NAME", val}
}

// 修改年龄
export function setAge(val){
	return { type: "SET_AGE", val}
}