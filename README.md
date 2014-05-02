# moloko.js

Set of modules for front-end architecture

## PubSub

Publish–subscribe pattern

**Main fetures**

* Subscribe/unsubscribe to one or several channels
* Publish to one or several channels
* Method *.one* fire one time and unsubscribe after that
* Have shortcuts: trigger, on, off

**Benchmarks**

http://jsperf.com/pubsubjs-vs-jquery-custom-events/142

**Example**

```javascript
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


channel.on('channel1', callback);

channel.trigger('channel1');

channel.off('channel1');
```
