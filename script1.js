function BinaryTree(el){
  this.element = el;
  this.left = null;
  this.right = null;
}


/******  User defined array Functions *******/
Array.prototype.last = function(){
	return this[this.length - 1];
};

Array.prototype.dequeue = function(){
	return this.splice(0, 1);
};

var operators = {'+':1, '-':1, '*':2, '/':2};

function createTree(infix){ // it is kind of preorder style, because we have node itself first then its child
  
	var postfix = infix2postfix(infix);
  document.getElementById('result_exp').value = postfix;

	var stack = []
	
	for(var i=0; i<postfix.length; i++){
		var char = postfix[i];
		if( operators[char] > 0 ){
			var tree = new BinaryTree(char);

			tree.right = stack.last().constructor === BinaryTree ? stack.pop() : new BinaryTree(stack.pop());
			tree.left = stack.last().constructor === BinaryTree ? stack.pop() : new BinaryTree(stack.pop());

			stack.push(tree);
		}
		else
			stack.push(char);
	}
  return stack.pop();
}

paper.install(window)          
paper.setup('myCanvas')

origin = [400, 25];
height = 3;

function paperNode(tree, depth, x){

  var pos = new Point(origin[0]+ x*height*50 , origin[1] + depth*60)
  
  function drawEdge(pos1, pos2){
    new Path.Line({from: pos1, to: pos2, strokeColor: 'black', strokeWidth:2}).sendToBack()
  } 

  if(tree.left) // if left exists, the right child also exists
		drawEdge(pos, pos.add([(1 / Math.pow(2,depth))*height*50, 60]))
	if(tree.right) // if left exists, the right child also exists
		drawEdge(pos, pos.add([-(1 / Math.pow(2,depth))*height*50, 60]))
	
  new Path.Circle( { radius:20, strokeWidth:2, fillColor: 'white', strokeColor:'black', center: pos });
  new PointText({ position: new Point(pos.x-8, pos.y+10), fontSize: '30px', fillColor: 'black', content:''+ tree.element});
		
	view.update();
}

function drawPreOrder(tree, depth, x){ // depth: depth of the current node, x: x-coordinate of the current node
  if(tree == null)
    return
  	  
  drawPreOrder(tree.left, depth+1, x-(1 / Math.pow(2,depth)))
//	  setTimeout(function() { new paperNode(tree, depth, x); }, 500*(t++));
  drawPreOrder(tree.right, depth+1, x+(1 / Math.pow(2,depth)))
		  setTimeout(function() { new paperNode(tree, depth, x); }, 500*(t++));

}

function getHeight(tree){
	if(tree == null)
		return 0;
	
	return Math.max(getHeight(tree.left)+1, getHeight(tree.right)+1) 	
}

window.evaluate = function(){	
	t=0;
	paper.setup('myCanvas')
	infix = document.getElementById("expression").value;
	var tree = createTree(infix)

	height = getHeight(tree);

	drawPreOrder(tree, 0, 0)
	view.update();
}
window.evaluate();


function isALetter(charVal)
{
    if( charVal.toUpperCase() != charVal.toLowerCase() )
       return true;
    return false;
}

function infix2postfix(infix){

	var stack = []
	var output = ''
	
	for(var i=0; i < infix.length; i++){
		var char = infix[i];
		
		if(isALetter( char ))
			output += char;
		else if( char == '(')
		  stack.push(char)
		else if(operators[char] > 0)
		{	
			if(stack.length == 0 || operators[char] > operators[stack.last()]) // higher precedence compared to stack, push it
			  stack.push(char)
			else{
				while( operators[char] <= operators[stack.last()] ) // as long as lower or equal prec. compared to stack, pop it
					output += stack.pop()

				stack.push(char)
			}
		}
		else if( char == ')')
		{
				while( stack.last() != '(' ) // as long as lower or equal prec. compared to stack, pop it
					output += stack.pop()	
			
				stack.pop()
		}
		//console.log(stack) // it can be used to show stack content step by step
	}
	while(stack.length > 0) // remaining items in stack will be automatically outputted
			output += stack.pop()

	return output;
}
