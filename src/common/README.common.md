## Common usage

This folder it is intended to use everything we need globally.

Do we need a global custom pipe? For example: to parse the ID from "string" to a "mongo db id".

# Generate
In case we need something to happen globally, generate the needed resource.
In this case we're seeing a pipe generation. 

You can check the existing pipe [check mongo db pipe here](./pipes/parse-mongo-id.pipe.ts)

```
nest g pi common/pipes/{name}
```