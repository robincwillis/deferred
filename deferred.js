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

				if(isArray(arguments[i])){
					var arr = arguments[i];
					for(var j = 0; j < arr.length; j++){
						if(status === 'rejected'){
							arr[j].apply(this, resultArgs);
						}
						failsFuncs.push(arr[j]);
					}

				}else{
					if(status === 'resolved'){

						arguments[i].appy(this, resultArgs);
					}
					doneFuncs.push(arguments[i]);
				}
			}
			return this;
		},

		fail: function(){
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
			var df = Deferred(),
			size = args.length,
			done = 0,
			rp = new Array(size);

			for(var i = 0; i < args.length; i++){
				(function(j){
					var obj = null;
					//this guy is done
					if(args[j].done){
						args[j].done(function(){
							rp[j] = (arguments.length < 2) ? arguments[0] : arguments;
							if(++ done == size){
								df.resolve.apply(df, rp);
							}

						})
						// .fail(function(){
						// 	df.reject(arguments);
						// })
					//this guy is not done
					}else{
						obj = args[j];
						args[j] = new Deferred();
						args[j].done(function(){
							rp[j] = (arguments.length < 2) ? arguments[0] : arguments;
							if(++done == size){
								df.resolve.apply(df, rp);
							}
						})
					}
				})(i);
			}
			return df.promise();
		})(arguments);
}