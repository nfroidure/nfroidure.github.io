<!--VarStream
title=Easily Implement Stacks (Fifo) And Queues (Lifo) With JavaScript
description=I'm currently reviewing Javascript basis for a personnal project\
 and it appears i often use stacks and queues implicitly. Let's make it\
 explicit and easyer to debug/use.
shortTitle=Stacks and queues
shortDesc=Discover my tips to sandbox your stacks and queues.
keywords.+=JavaScript
categories+=keywords.*
keywords.+=stack
keywords.+=queue
keywords.+=LIFO
keywords.+=FIFO
keywords.+=implementation
published=2013-04-09T11:50:52.000Z
lang=en
location=US
-->

## Easily Implement Stacks (Fifo) And Queues (Lifo) With JavaScript

It's really easy to create queues (<acronym title=First In First Out>FIFO</acronym>)
 by simply creating an Array and only use push and shift methods. The same goes
 for stacks (<acronym title=Last In First Out>LIFO</acronym>) with push and
 pop. But when coming back to the code or working together it can lead to
 hardly detectable bugs or unexpected behaviors. That's why i decided to
 implement them seriously with the help of the closure pattern. Let's dive in
 the code.

### Queues : First In Firt Out

Here is the code :

<script type="text/javascript" src="https://gist.github.com/nfroidure/5472445.js"></script>
<noscript><pre>
var Queue = function() {
	 var functionSet=(function() {
		 var _elements=[]; // creating a private array
		 return [
		 // push function
		 function()
		 	{ return _elements.push .apply(_elements,arguments); },
		  // shift function
		 function()
		 	{ return _elements.shift .apply(_elements,arguments); },
		 function() { return _elements.length; },
		 function(n) { return _elements.length=n; }];
	 })();
	 this.push=functionSet[0];
	 this.shift=functionSet[1];
	 this.getLength=functionSet[2];
	 this.setLength=functionSet[3];
	 // initializing the queue with given arguments
	 this.push.apply(this,arguments);
};

// Usage
var q=new Queue(0,1), e;
q.push(2);
console.log(q.getLength()); // 3
while(undefined!==(e=q.shift()))
	console.log(e); // 0, 1, 2 
</pre></noscript>

The tip is deadly simple, we're keeping a reference to the elements in the
 scope of our set of functions and the Queue instances expose only those
 functions as methods. So, we're sure our queues will be used properly.

If you're coding in a modern JavaScript engine you'll probably want to access
 the queue length as a property like it's done with arrays or strings. Here is
 the way to:

<script type="text/javascript" src="https://gist.github.com/nfroidure/5472480.js"></script>
<noscript><pre>
var Queue = function() {
	var functionSet=(function() {
		var _elements=[]; // creating a private array
		return [
		// push function
		function()
		{ return _elements.push .apply(_elements,arguments); },
		// shift function
		function()
		{ return _elements.shift .apply(_elements,arguments); },
		function() { return _elements.length; },
		function(n) { return _elements.length=n; }];
	})();
	this.push=functionSet[0];
	this.shift=functionSet[1];
	Object.defineProperty(this,'length',{
		'get':functionSet[2],
		'set':functionSet[3],
		'writeable':true,
		'enumerable':false,
		'configurable':false
	});
	// initializing the queue with given arguments
	this.push.apply(this,arguments);
};

var q=new Queue(0,1), e;
q.push(2);
console.log(q.length); // 3
while(undefined!==(e=q.shift()))
console.log(e); // 0, 1, 2 
</pre></noscript>

### Stacks (Last In First Out)

Now we can simply modify the above code to also manage stacks:

<script type="text/javascript" src="https://gist.github.com/nfroidure/5472493.js">
</script>
<noscript><pre>
var Stack = function() {
	var functionSet=(function() {
		var _elements=[]; // creating a private array
		return [
		// push function
		function()
		{ return _elements.push .apply(_elements,arguments); },
		 // pop function
		function()
		{ return _elements.pop .apply(_elements,arguments); },
		function() { return _elements.length; },
		function(n) { return _elements.length=n; }];
	})();
	this.push=functionSet[0];
	this.pop=functionSet[1];
	this.getLength=functionSet[2];
	this.setLength=functionSet[3];
	// initializing the stack with given arguments
	this.push.apply(this,arguments);
};

var s=new Stack(0,1), e;
s.push(2);
console.log(s.getLength()); // 3
while(undefined!==(e=s.pop()))
	console.log(e); // 2, 1, 0
</pre></noscript>

As you can see JavaScript closures allows you to easily create constructors
 using only a subset of an existing data type. Feel free to use or patch it !

