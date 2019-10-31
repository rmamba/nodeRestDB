# nodeRestDB
This is a NodeJS version of my original pyRestDB.
It is now actually rewriten in TypeScrypt.
I rewrote it just for fun as I started working with NodeJS more and was currious.
I used the python version on raspberry pi succesfully to temporarily store data in memory.
This in memory JSON structure prolongs the lifespan of the SD card as we only write to SD card a batch of data once we collect enough in memory.

# Installation
To play with it locally you can pull the `git` repository and run these commands:
```
npm install
npm start
```

You can also compile the project and run it with node:
```
npm install
npm run build
node dist/index.js
```

If you want a docker container you can build it with:
```
docker build .
```

Service is available locally on port 3000 by default `http://localhost:3000`

# Write data with POST method
If we execute this `POST` post command:
```
http POST :3000/v1/db/test/test2/test3 data:'{"thirteen":13, "pi":3.14}'
#returns {code: 1} on success
```
We will write the date into the in memory JSON structure.
If the path `test/test2/test3` does not exist, it will be created.
When it exists it will be overriden! After this operation you can read out the values.

# Reading data
Call to:
```
http GET :3000/db/v1/test/test2/test3
```
Will return:
```JSON
{
  "thirteen": 13,
  "pi": 3.14
}
```
How ever a call to:
```
http GET :3000/db/v1/test/test2/test3/pi
```
Will return:
```
3.14
```
Where as call to:
```
http GET :3000/db/v1/test
```
Will return:
```
{
  "test2": {
    "test3": {
      "thirteen": 13,
      "pi": 3.14
    }
  }
}
```
As you can see you can read as much data as you want or you can go as deep along the tree as needed.

# Write data with PUT command
`PUT` command works a bit differently than `POST`. But you can achieve the same result with both of them. With `PUT` command you send the data in the request body which is a JSON with `path` and `value` parameters. For example if we want to get same result as with the `POST` example above we would execute:
```
http PUT :3000/v1/db path:'test/test2/test3' value:'{"thirteen":13, "pi":3.14}'
```
This will write the same data to the in memmory JSON structure as our POST example above.
When sending data programatically a JSON structure of the body would look like this:
```JSON
{
  "path": "test/test2/test3",
  "value": {
    "thirteen":13,
    "pi":3.14
  }
}
```

# Hiding your data:
In case you need it, there is a simple way to hide your data from public view. Simply add `secret` field to the `headers` of your requests. With this all your data will go into a separate in memmory structure that can only be accessed with your secret key.
For example here is the same request as above but with a secret set in request header.
```
http POST :3000/v1/db/test/test2/test3 data:'{"krneki13":13, "butast":3.14}' secret:'mySuperSecret'
```
It makes sense to choose a secure secret, you can generate a GUID string or simmilar and use that as your secret.

# ToDO
- [ ] Write tests
- [ ] Fix delete
- [ ] Implement admin
- [ ] Implement security
