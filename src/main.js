var Beagle;


(function(){

	"use strict";
	
	/*******
	*
	* Private Variables
	*
	*******/
	var DBName = 'DB';
	var schema = {};
	
	
	/*******
	*
	* Intialisierung nach dem Fassade Entwurfsmuster 
	*
	*******/
	
	var Initialize = function(){
		
		/*
		*
		*Create localstorage db
		*
		*/
		
		DB().init();
		
		var _methods = {
		
			Schema: function(_schema){
				return Schema(_schema);
			}
		
		};
		
		_methods = merge(_methods, Collection());
		
		return _methods;
		
	}
		
	/*******
	*
	* Def. Schema
	*
	*******/
	
	var Schema = function(_data){
		
		/*
		*
		* _id generator?
		*
		*/
		
		var _schema = {};
		_schema['_id'] = _data['_id'] ||  { label: 'id' };
		
		/*
		*
		* Möglichkeit zur Validierung der Schema
		*
		*/
		
		
		for(var k in _data){
			
			_schema[k] = _data[k]
			
		}
		
		
		schema = _schema;
		
	}
	
	/*******
	*
	* Def. Collection
	*
	*******/
	
	var Collection = function(){
		
		var _collection = [];
		
		/*******
		*
		* CRUD METHODS
		*
		*******/
		
		var _methods = {
			
			insert: function(_data){
				
				DB().set(formatter(_data));	
				
			},
			
			removeById: function(id){
			
				//var attr = ['_id', id];
				var db = DB().get();
			
				delete db[id];
				DB().refresh(db)
				db = null;
				//delete DB().remove(attr);
				
			},
			
			updateByid: function(id, data){
			
				for(var key in data){
					
					if(key === 'set'){
						//set function
					}
					
					if(key === 'push'){
						//push function
					}
					
				}
			
			},
			
			find: function(attr){
				
				var db = DB().get();
				
				var arr = [];
				var toSearch = {};
				var found = [];
				
				for(var key in db){
					arr.push(unform(db[key]));
				}
								
				for(var key in attr){
					
					if(key !== undefined){
					
						toSearch[0] = key;
						toSearch[1] = attr[key];	
				
					}else{
				
						throw error.noQuery;
				
					}
				
				}
				
				if(attr === undefined){
					
					return Cursor(arr);
						
				}
				
				
				each(arr, function(doc){
					
					if(doc[toSearch[0]] === toSearch[1]){
						
						found.push(doc);
						
					}
					
				});
				
				db = null;
				
				return Cursor(found);
				
			
			},
			
			findById: function(id){
				
				return unform(DB().get()[id]);
				
			}
			
		}
		
		//Update Helper function
		function update_set(id){
			
			
			
		};
		function update_push(id){
			
			
			
		};
		
		function unform(db_obj){
			var obj = {};
			for(var key in db_obj){
				
				if(key !== '_id'){
					obj[key] = db_obj[key].value;
				}else{
					obj[key] = db_obj[key];
				}
				
			}
			return obj;
		}
		
		function formatter(_data){
			
			var doc = {};
			
			if(_data['_id'] === undefined){
			
				_data['_id'] = createId();
			
			}
			
			for(var key in getSchema()){
				
				doc[key] = {
					
					value: _data[key],
					label: getSchema()[key].label
				
				};
				
			
			}
					
			return doc;
			
		}
		
		
		return _methods;
		
	
	}
	
	
	/*******
	*
	* CURSOR
	*
	*******/
	
	var Cursor = function(obj){
		
		var _methods = {
		
			count: function(){
				
				return obj.length;
			
			},
			
			fetch: function(){
				
				return obj;
				
			},
			
			where: function(attr){
				
			}
		
		};
		
		return _methods;
		
	}
	
	/*******
	*
	* Synchronize to Localstorage API
	*
	*******/
	
	var DB = function(){
		
		
		var _methods = {
			
			init:  function(){
				
				_initialize();
				
			},
			
			set: function(obj){
				
				var db = this.get();
				db[obj._id.value] = obj;
				localStorage.setItem(DBName, JSON.stringify(db));
				
			},
			
			refresh: function(db){
				
				localStorage.setItem(DBName, JSON.stringify(db));
				
			},

			get: function(){
				
				var strDB = localStorage.getItem(DBName);
				
				if(strDB !== null){
				
					return JSON.parse(strDB);
					
				}else{
				
					return undefined;
				
				}
				
			}
		
		}
		
		
		function _initialize(){
			
			if(localStorage !== undefined){
				
				if(_methods.get() === undefined){
					
					localStorage.setItem(DBName, "{}");	
				
				}
				
			}else{
				
				throw error.noLocalStorage;
				
			}
			
		}
		
		return _methods;
		
	}
	
	
	/*******
	*
	* GETTER AND SETTER
	*
	*******/
	
	function getSchema(){
		
		return schema;
		
	}
	
	/*******
	*
	* ERRORS
	*
	*******/
	
	var error = {
		
		noLocalStorage: "Your Browser does not Support LocalStorage",
		noQuery: "Your find parameter is empty"
		
	};
	
	
	/*******
	*
	* HELPER FUNCTIONS
	*
	*******/
	
	/*
	*	create custom id
	*/
	
	function createId(){
		
		var currDate = Date.now();
		var ran = Math.floor(Math.random() * currDate - (currDate + 1000) +   (currDate + 1000));
		return ran;
		
	}
	
	/*
	*	each loop methode
	*/
	
	function each(arr, callback){
		
		var i = arr.length; 
		while (i--){ 
			callback(arr[i], i);
		}
		
	}
	
	/*
	*	merge two objects
	*/
	
	function merge(mainObj, toMerge){
		
		var obj = {};
		
		for (var attr in mainObj) { obj[attr] = mainObj[attr]; }
    for (var attr in toMerge) { obj[attr] = toMerge[attr]; }
		
		return obj;	
	
	}
	
	/*******
	*
	* Fabrikmethode
	*
	*******/
	
	Beagle = new Initialize();
	
	
})();



/*******
*
* TEST UMGEBUNGS
*
*******/

(function(){
	
	"use strict";
	
	Beagle.Schema({
		username: {
			label: 'Username'
		},
		email: {
			label: 'Email'
		}
	});
	
	var btn = document.getElementById('save_btn').addEventListener('click', function(){
		
		var obj = {
			
			username: document.getElementById('username').value,
			email: document.getElementById('email').value
			
		};
		
		Beagle.insert(obj);
		
	}, false);
	
	
	//Beagle.removeById(1323646724530);
	//var test = Beagle.findById(884378941887);
	Beagle.insert({username: 'alex', email: 'test'});
	//Beagle.updateByid(884378941887, {set: {email: 'SET!!!'}});
	
})();
