/*******
*
* Globale Variables
*
*******/
var Beagle;

(function(){
	
	
	"use strict";
	
	/*******
	*
	* Private Variables
	*
	*******/
	var schemas = {};
	
	
	/*******
	*
	* Error Messages
	*
	*******/
	
	var errorMsg = {
	
		nolocalstorage: "your browser doesn't support localstorage",
		schemaUndefined: "you have to defined a schema: Beagle.schema(schemaname:string, schemafields:array)",
		schemaNameEmpty: "you have to define a name for your schema",
		collectionNameUndefined: "collection name dont exist",
		collectionNotExist: "Collection dont exist",
		indexUndefined: "Index is undefinded",
		notInSchema: "attribute not in schema define"
		
	}
	
	/*******
	*
	* Intialisierung nach dem Fassade Entwurfsmuster 
	*
	*******/
	
	var Initialize = function(){
		
		
		if(!checkSystem()){
		
			throw	errorMsg.nolocalstorage;
		
		}
		
		
		var methods = {
		
			schema: function(collectionName, schemaFields){
				
				
				if( (collectionName !== undefined && typeof collectionName === "string" ) && (schemaFields !== undefined &&  schemaFields[0] !== undefined ) ){
					
					var sn = collectionName;
					var sf = schemaFields;
					
					if(sn.length === 0){
						throw errorMsg.schemaNameEmpty;
					}
					
					sn = conformSchemaName(sn);
						
					return Schema().schema(sn, sf);	
				
				}else{
				
					throw errorMsg.schemaUndefined;
				
				}
				
			}
		}
		
		methods = merge(methods, Collection());
		methods = merge(methods, Observer());
		
		return methods
		
	}
	
	/*******
	*
	* System check funtion
	*
	*******/
	
	function checkSystem(){
		
		if(window.localStorage === undefined){
		
			return false;
		}
		
		return true;
		
	}
	
	/*******
	*
	* Def. Collection
	*
	*******/
	
	var Collection = function(){
		
		
		function checkCollectionName(collectionName){
			
			if( (collectionName !== undefined && typeof collectionName === "string") && ( Database().existCollection(collectionName) === true ) ){
				
				return true;
				
			}else{
				
				return false;
				
			}
			
		}
		
		function isAttr(collectionName, attr){
			
			var _schemas = makeObject(schemas[collectionName]);
			
			for(var key in attr){
			
				if(_schemas[key] === undefined){
					return false;
				}
				
			}
			
			return true;
		}
		
		function pushHandler(model, modify){
			
			var newModel = model;
			
			for(var key in modify){
			
				if(newModel[key] instanceof Array){
					
					newModel[key].push(modify[key]);
					
				}
			
			}
			
			return newModel;
			
		}
		
		function pullHandler(model, modify){
		
			var newModel = model;
			
			for(var key in modify){
				
				if(newModel[key] instanceof Array){
					
					var index = newModel[key].indexOf(modify[key]);
					if (index > -1) {
						 newModel[key].splice(index, 1);
					}
					
				}
				
			}
			
			return newModel;
			
		}
		
		function setHandler(model, modify){
			
			var newModel = model;
			
			for(var mod in modify){
			
				newModel[mod] = modify[mod]
			
			}
			
			return newModel;

		}
		
		
		function isNot(a,b){
			if(a !== b){
				return true;
			}else{
				return false;
			}
		}
		
		function is(a,b){
			if(a === b){
				return true;
			}else{
				return false;
			}
		}
		
		return {
			
			insert: function(collectionName, model){
				
				if(!checkCollectionName(collectionName)){
				
					throw errorMsg.collectionNameUndefined;
				
				}
				
				var fields = schemas[collectionName];
				
				var createModel = {
				
					index: createId()
				
				}
				
				each(fields, function(field){
					
					createModel[field] = model[field]
					
				});
				
				Database().addModel(collectionName, createModel);
				
				observe('add', createModel);
				
				return createModel;
				
			},
			
			removeByIndex: function(collectionName, id){
				
				if(!checkCollectionName(collectionName)){
					
					throw errorMsg.collectionNameUndefined;
					
				}
				
				var collections = Database().getCollection(collectionName);
				var deleted;
				
				if(collections !== undefined){
					
					deleted = collections[id];
					
					delete collections[id];
					
					Database().save(collectionName, collections);
					observe('remove', deleted);
						
				}		
				
			},
			
			findByIndex: function(collectionName, id){
				
				if(id === undefined){
					
					throw errorMsg.indexUndefined;
					
				}
				
				if(!checkCollectionName(collectionName)){
					
					throw errorMsg.collectionNameUndefined;
					
				}
				
				var collections = Database().getCollection(collectionName);
				
				return collections[id];
				
				
			},
			
			findIndex: function(collectionName, attr){
				
				var operator;
				var fieldAttr;
				
				for(var operator in attr){
					
					operator = operator;
					fieldAttr = attr[operator];
					
				}
				
				var collections = Database().getCollection(collectionName);
				
				if(!isAttr(collectionName, fieldAttr)){
					
					throw errorMsg.notInSchema;
					
				}
				
				var search = [];
				
				for(var key in fieldAttr){
					
					search.push(key);
					search.push(fieldAttr[key]);
					
				}
				
				var results = [];
				
				for(var model in collections){
					
					var c = false;
					
					switch(operator){
					
						case 'is':
							c = is(collections[model][search[0]], search[1]);
						break;
					
						case 'isNot':
							c = isNot(collections[model][search[0]], search[1]);
						break;
					
					}
					
					if(c){
						results.push(model);
					}
					
				}
				
				return results;
				
				
			},
			
			find: function(collectionName, attr){
				
				var indizes = this.findIndex(collectionName, attr);
				var collections = Database().getCollection(collectionName);
				var results = [];
				
				each(indizes, function(index){
				
					results.push(collections[index]);
				
				});
				
				return Cursor(results);
			
			},
			
			findAll: function(collectionName){
				
				if(!checkCollectionName(collectionName)){
					
					throw errorMsg.collectionNameUndefined;
					
				}
				var results = [];
				var collections = Database().getCollection(collectionName);
				for(var model in collections){
					results.push(collections[model]);
				}
				return Cursor(results);
			},
			
			remove: function(collectionName, attr){
				
				var indizes = this.findIndex(collectionName, attr);
				var collections = Database().getCollection(collectionName);
				var self = this;
				var deleted = [];
				
				each(indizes, function(index){
					
					deleted.push(collections[index]);
					self.removeByIndex(collectionName, index);
					
				});
				
				return Cursor(deleted);
				
			},
			
			update: function(collectionName, attr, modifiers){
				
				var indizes = this.findIndex(collectionName, attr);
				var self = this;
				var updated = []
				
				each(indizes, function(index){
					
					self.updateByIndex(collectionName, index, modifiers);
					
				});
				
				var collections = Database().getCollection(collectionName);
				
				each(indizes, function(index){
					
					updated.push(collections[index]);
					
				});
				
				return Cursor(updated);
			},
			
			updateByIndex: function(collectionName, id, modifiers){
				
				if(!checkCollectionName(collectionName)){
					
					throw errorMsg.collectionNameUndefined;
					
				}
				
				if(id === undefined){
					
					throw errorMsg.indexUndefined;
					
				}
				
				var model = Database().getCollection(collectionName)[id];
				
				for(var mod in modifiers){
						
					var modify = modifiers[mod];
					
					if(!isAttr(collectionName, modifiers[mod])){
					
						throw errorMsg.notInSchema;
					
					}
					
					var model;
					
					switch(mod){
					
						case 'set':
							model = setHandler(model, modify);
						break;
						
						case 'push':
							model = pushHandler(model, modify);
						break;
						
						case 'pull':
							model = pullHandler(model, modify);
						break;
							
					}
					
				}
				
				var collections = Database().getCollection(collectionName);
				collections[model.index] = model;
				
				Database().save(collectionName, collections);
				
				observe('update', updated);

			}
			
		}
		
	}
	
	/*******
	*
	* Def. Cursor Object
	*
	*******/
	
	var Cursor = function(collection){
		
		var collection = collection;
		
		return {
			
			count: function(){
			
				return collection.length;
			
			},
			
			fetch: function(){
			
				return collection;
			
			},
			
			where: function(attr){
			
			
				
			},
			
			sort: function(){
				
				
			}
			
		}
		
	}
	
	/*******
	*
	* Def. Schema Object
	*
	*******/
	
	var Schema = function(){
				
		return {
			
			schema: function(collectionName, schemaFields){
				
				
				schemas[collectionName] = schemaFields;
				
				if(Database().createCollection(collectionName)){
					
					schemas[collectionName] = schemaFields;
					return true;
					
				};
				
				return false;
				
			}
			
		}
		
	}
	
	/*******
	*
	* Def. Observer Object
	*
	*******/
	
	var listener = {
		update: [],
		remove: [],
		add: []
	}
	
	function observe(listen, obj){
		
		each(listener[listen], function(fn){
			
			fn(obj);
			
		});
		
	}
	
	var Observer = function(){
		
		return {
			
			on: function(listener_key, callback){
				
				listener[listener_key].push(callback);
				
			}
			
		}
		
	}
	
	/*******
	*
	* Localstorage API
	*
	*******/
	
	var Database = function(){
		
		return {
			
			
			addModel: function(collectionName, model){
				
				
				if( !this.existCollection(collectionName) ){
					throw errorMsg.collectionNotExist;
				}
				
				var collection = this.getCollection(collectionName);
				collection[model.index] = model;
				this.save(collectionName, collection);
				
			},
			
			save: function(collectionName, db){
				
				localStorage.setItem(collectionName, JSON.stringify(db))
				
			},
			
			existCollection: function(collectionName){
				
				if(localStorage.getItem(collectionName) !== null){
				
					return true;
				
				}else{
				
					return false;
				
				}
						
			},
			
			createCollection: function(collectionName){

				
				if(! this.existCollection(collectionName) ){
					
					localStorage.setItem(collectionName, JSON.stringify({}));
				
					return true;	
				
				}
				
				return false;
				
			},
			
			getCollection: function(collectionName){


				if(this.existCollection(collectionName) ){
					
					return JSON.parse(localStorage.getItem(collectionName));
					
				}
				
			}
			
			
		}
		
	}
	
	/*******
	*
	* helper function
	*
	*******/
	
	function conformSchemaName(_str){
		
		var str = _str;
		
		str = str.replace(/\s/g, '');
		str = str.toLowerCase();
				
		return str;
		
				
	}
	
	function makeObject(arr){
		
		var obj = {};
		
		each(arr, function(field){
				
				obj[field] = field;
				
		});
		
		return obj;
		
	}
	
	function merge(mainObj, toMerge){
		
		var obj = {};
		
		for (var attr in mainObj) { obj[attr] = mainObj[attr]; }
    for (var attr in toMerge) { obj[attr] = toMerge[attr]; }
		
		return obj;	
	
	}
	
	function createId(){
		
		var currDate = Date.now();
		var ran = Math.floor(Math.random() * currDate - (currDate + 1000) +   (currDate + 1000));
		return ran;
		
	}
	
	function each(arr, callback){
		
		var i = arr.length; 
		while (i--){ 
			callback(arr[i], i);
		}
		
	}
	
	
	Beagle = new Initialize();
	
	
})();