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
			console.log('done called');
			for(var i = 0; i < arguments.length; i++){
				if(isArray(arguments[i])){
					var arr = arguments[i];
					for(var j = 0; j < arr.length; j++){
						if(status === 'rejected'){
							console.log('rejected');
							arr[j].apply(this, resultArgs);
						}
						failsFuncs.push(arr[j]);
					}

				}else{
					if(status === 'resolved'){
						console.log('rejected');
						arguments[i].appy(this, resultArgs);
					}
					doneFuncs.push(arguments[i]);
				}
			}
			return this;
		},
		fail: function(){
			console.log('fail called');
			for (var i = 0; i < arguments.length; i++){
				if(isArray(arguments[i])){
					var arr = arguments[i];
					for (var j = 0; j < arr.length; j++) {
						if (status === 'rejected') {
							arr[j].apply(this, resultArgs);
						}
						failFuncs.push(arr[j]);
					}
				}else{
					if(status === 'rejected') {
						arguments[i].apply(this, resultsArgs);
					}
					failFuncs.push(arguments[i]);
				}
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
				for(var i = 0; i < failFuncs.length; i++){
					failFuncs[i].apply(context, args);
				}
			}
			return this;
		},
		resolve : function(){
			console.log('resolve called now');
			return this.resolveWith(this, arguments);
		},
		reject : function(){
			console.log('reject called now');
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
		var rp = new Array(args.length);

		for(var i=0; i < args.length; i++){
			(function(j){
				args[j]
				.done(function(){
					rp[j] = (arguments.length < args.length) ? arguments[0] : arguments;
					if(++ done == args.length){
						dfd.resolve.apply(dfd, rp);
					}
				})
				.fail(function(){
					rp[j] = (arguments.length < args.length) ? arguments[0] : arguments;
					if(++ done == args.length){
						dfd.reject.apply(dfd, rp);
					}
				})
			})(i)
		};
		return dfd.promise();
	})(arguments)

};
