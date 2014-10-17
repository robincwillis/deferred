function isArray(arr) {
	return Object.prototype.toString.call(arr) === '[object Array]';
}

function Deferred(fn) {
	var status = 'pending';
	var doneFuncs = [];
	var failFuncs = [];
	//var resultArgs = null;

	var promise = {

		done: function(){
			for(var i = 0; i < arguments.length; i++){
					doneFuncs.push(arguments[i]);
			}
			return this;
		},
		fail: function(){
			 for (var i = 0; i < arguments.length; i++){
					failFuncs.push(arguments[i]);
			}
			return this;
		},
		then : function(){
			if (arguments.length > 1 && arguments[1]){
				this.fail(arguments[1]);
			}
			if (arguments.length > 0 && arguments[0]){
				this.done(arguments[0]);
			}
		},
		promise : function(obj){
			if(obj == null){
				return promise;
			} else{
				for( var i in promise){
					obj[i] = promise[i];
				}
			}
			return obj;
		},
	}

	var deferred = {
		//here we resolve the object and execute stored functions (callbacks from then)
		resolveWith : function(context){
			if(status === 'pending'){
				status = 'resolved';
				var args = resultsArgs = (arguments.length > 1) ? arguments[1] : [];
				for(var i = 0; i < doneFuncs.length; i++){
					doneFuncs[i].apply(context, args);
				}
			}
		},
		rejectWith : function(context){
			if(status === 'pending'){
				status = 'rejected';

				var args = (arguments.length > 1) ? arguments[1] : [];
				for(var i = 0; i < failFuncs.length; i++){;
					failFuncs[i].apply(context, args);
				}
			}
			return this;
		},
		resolve : function(){
			return this.resolveWith(this, arguments);
		},
		reject : function(){
			return this.rejectWith(this, arguments);
		},
	}

	var obj = promise.promise(deferred);

	if(fn){
		fn.apply(obj, [obj]);
	}

	return obj;
}

Deferred.when = function(){

	return (function(args){
		var dfd = Deferred();
		var done = 0;
		var resp = new Array(args.length);

		for(var i=0; i < args.length; i++){
			(function(j){
				args[j]
				.done(function(){
					resp[j] = (arguments.length < args.length) ? arguments[0] : arguments;
					if(++ done == args.length){
						dfd.resolve.apply(dfd, resp);
					}
				})
				.fail(function(){
					resp[j] = (arguments.length < args.length) ? arguments[0] : arguments;
					if(++ done == args.length){
						dfd.reject.apply(dfd, resp);
					}
				})
			})(i)
		};
		return dfd.promise();
	})(arguments)

};
