# moloko.js

Set of modules for front-end architecture

## PubSub

Publish–subscribe pattern

**Main fetures**

* Subscribe/unsubscribe to one or several channel
* Publish to one or several channel
* Method *.one* fire one time and unsubscribe after

**Example**

```
var channel = new PubSub();

function callback (e, data) {
    console.log(e, data);
}

channel.subscribe('channel1 channel2 channel3', function (e, data) {
   console.log(e, data);
})

channel.subscribe('channel3', callback);

channel.one('channel4', function (e, data) {
   console.log(e, data);
});

channel.publish('channel1 channel2 channel3', {'key': 'value'});

channel.publish('channel4', {'key': 'value'});

channel.unsubscribe('channel1 channel2');

channel.unsubscribe('channel3', callback);

channel.unsubscribe('channel3');
```