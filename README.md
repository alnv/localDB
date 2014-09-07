# localDB.js
=======

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

## Create schema(String, Array)

```
  localDB.schema("users", ["id", "username", "email", "age"]);
  localDB.schema("posts", ["title", "description", "userID"]);
```

## add(String, Object) new item to your collection

```
  localDB.add("users", {
    id: 1
    username: "Max",
    email: "max.mustermann@gmail.de",
    age: 34
  });
```

## remove(String, Object) item from your collection

```
  localDB.remove('users', {is: {username: "max"}});
  
  //{is: {}} is like "==="
  //{not :{}} is like "!=="
  //{gt :{}} is like ">"
  //{gte :{}} is like ">="
  //{lt :{}} is like "<="
  //{lte :{}} is like "<="
  //{has :{arr: 32}} search for field in an array
  
  
```

