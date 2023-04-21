
interface UserInfo {
	id: number,
	name: string,
	pid: number,
  }
  let arr:UserInfo[] = [
	  {id: 1, name: '部门1', pid: 0},
	  {id: 2, name: '部门2', pid: 1},
	  {id: 3, name: '部门3', pid: 1},
	  {id: 4, name: '部门4', pid: 3},
	  {id: 5, name: '部门5', pid: 4},
  ]
  const arrToFlat = (arr: UserInfo[]) => {
	let newArr = []
	let newDic: any = {}
	for (let i = 0; i < arr.length; i++) {
	  newDic[arr[i].id] = {...arr[i], children: []}
	}
	for (let i = 0; i < arr.length; i++) {
	  if (!newDic[arr[i].pid]) {
		newArr.push(newDic[arr[i].id])
	  } else{
		newDic[arr[i].pid].children.push(newDic[arr[i].id])
	  }    
	}
	return newArr
  }
  
  const arrToFlat2 = (arr: UserInfo[]) => {
	let newArr: any = []
	let newDic: any = {}
	arr.reduce<any>((_prea, cur) => {
	  const id = cur.id;
	  const pid = cur.pid
	  if (!newDic[id]) {
		newDic[id] = { ...cur, children: [] }
	  }
	  const item = newDic[id]
	  if (pid === 0) {
		newArr.push(item)
	  } else {
		if (!newDic[pid]) {
		  newDic[pid] = { ...cur, children: [] }
		}
		newDic[pid].children.push(item)
	  }
	}, [])
	return newArr
  }
  const info = arrToFlat(arr)
  const info2 = arrToFlat2(arr);
  console.log(JSON.stringify(info2, null, 2))
  console.log(JSON.stringify(info, null, 2) == JSON.stringify(info2, null, 2))
  