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
		
		Save().init();
		
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
		
		var _schema = {
			_id: {
				label: 'id',
				Type: Number
			}
		};
		
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
			
			insert: function(_data, callback){
				
				callback(_data);
				
			},
			
			delete: function(id){
				
				
				
			},
			
			update: function(attr, data){
				
				
				
			}
			
		}
		
		return _methods;
		
	
	}
	
	/*******
	*
	* Synchronize to Localstorage AIP
	*
	*******/
	var Save = function(){
		
		
		var _methods = {
			
			init:  function(){
				
				_initialize();
				
			},
			
			setName: function(newName){
				
				//
				
			},
			
			show: function(){
				
				//
				
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
					
					localStorage.setItem(DBName, "[]");	
				
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
		
		noLocalStorage: "Your Browser does not Support LocalStorage"
		
	};
	
	
	/*******
	*
	* HELPER METHODEN
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
	
	var Schema = Beagle.Schema({
		
		title: {
			label: 'Titel',
			Type: String
		},
		
		plz: {
			label: 'Postleitzahl',
			Type: Number
		},
		
		gender: {
			label: 'Geschlecht',
			Type: Boolean
		},
		
		address: {
			label: 'Kommentare',
			Type: Object
		},
		
		comments: {
			label: 'Kommentare',
			Type: Array
		}
		
	});
	
	Beagle.insert({
		title: 'Test',
		plz: 75172,
		gender: false,
		address: {
			city: 'Pforzheim',
			street: 'Maurerstraße'
		},
		comments: [
			{
				msg: 'Hallo'
			},
			{
				msg: 'Welt'
			}
		]
	}, function(doc){
		console.log(doc);
	});
	
	
})();
