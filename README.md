# localDB.js

localDB.js provides couple of functions to interact with localStorage API. Inspired by mongoDB.

this methods are available

- schema()
- add()
- remove()
- update()
- find()
- findAll()
- watch()
- empty()
- collections()

## add localDB in your html file

```javascript
<script src="localDB.js"></script>

```


## Create schema(String, Array)

```javascript
  localDB.schema("users", ["id", "username", "email", "age"]);
  localDB.schema("posts", ["title", "description", "userID"]);
```

## add(String, Object) new item to your collection

```javascript
  localDB.add("users", {
    id: 1
    username: "Max",
    email: "max.mustermann@gmail.de",
    age: 34
  });
```

## remove(String, Object) item from your collection

```javascript
  localDB.remove('users', {is: {username: "max"}});
  
  //{is: {}} is like "==="
  //{not :{}} is like "!=="
  //{gt :{}} is like ">"
  //{gte :{}} is like ">="
  //{lt :{}} is like "<="
  //{lte :{}} is like "<="
  //{has :{arr: 32}} search for field in an array
  
  
```

## update(String, Object, Object)

```javascript
  localDB.update('users', {is: {username: "max"}}, {set: {age: 35 } );
  
  //if you have an array item you can use pull or push method
  localDB.update('users', {is: {username: "max"}}, {push: {arr: 34}} );
  localDB.update('users', {is: {username: "max"}}, {pull: {arr: 34}} );
  
```

## find(String, Object)

```javascript
  var cursor = localDB.find('users', {is: {username: 'max'}});
  //var cursor = localDB.find('users', {gt: {age: 30}});
  
  //find method return cursor object that contain this methods:
  cursor.count() //return number of your items
  cursor.fetch() // return an array
  cursor.limit() // limit(0, 5) return just five items
  cursor.where({not: {username: 'max'}}) // return cursor object
  
  
```

## watch(String, Callback) 
you can observe add, update and remove methods

```javascript
  localDB.watch('add', function(obj, colname){
    //
  });
  
  localDB.watch('remove', function(obj, colname){
    //
  });
   
  localDB.watch('update', function(obj, colname){
    //
  });
  
```
## empty(String) method delete all items in a collection

```javascript
  localDB.empty(users);
  
```

## collections() return entire database

```javascript
  localDB.collections();
  
```

### Author: [Alexander Naumov](http://www.alexandernaumov.de)
