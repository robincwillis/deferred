deferred
========

Drop dead simple Javascript promises


		function asyncEvent(){
			var dfd = new Deferred();
			setTimeout(function(){
				dfd.resolve("hip hop");
			}, Math.floor(Math.random()*1500));
			return dfd.promise();
		};

		function asyncEvent2(){
			var dfd = new Deferred();
			setTimeout(function(){
				dfd.resolve('hurray');
			}, Math.floor(Math.random()*1500));
			return dfd.promise();
		};

		Deferred.when(asyncEvent(), asyncEvent2()).then(
			function(status1, status2){
				console.log(status1 +" : "+ status2 + ', resolved');
			},
			function(status1, status2, status3){
				console.log(status1 + status2 + ', failed');
			}
		);