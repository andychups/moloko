describe('PubSub', function () {
    var channel;

    /**
     * + подписка на один канал / публикация на один канал
     * + подписка на несколько каналов / публикация на несколько каналов
     * + одноразовая подписка на один канал / одноразовая публикация на один канал
     * + одноразовая подписка на несколько каналов / одноразовая публикация на несколько каналов
     * - порядок выполнения событий
     *
     * + отписка от одного канала (с каллбеком и без)
     * + отписка от нескольких каналов (с каллбеком и без)
     * + отписка от разовой подписки одного канала (с каллбеком и без)
     * + отписка от разовой подписки нескольких каналов (с каллбеком и без)
     */

    beforeEach(function () {
        channel = new PubSub();
    });

    describe('Subscribe and Publish', function () {

        it("subscribe to one channel and publish to one channel", function () {
            var eventName = null,
                eventData = null;

            channel.subscribe('event', function (e, data) {
                eventName = e.name;
                eventData = data;
            });

            channel.publish('event', 'myData');
            expect(eventName).toEqual('event');
            expect(eventData).toEqual('myData');
        });


        it("subscribe to several channels and publish to several channels", function () {
            var eventName = null,
                eventData = null;

            channel.subscribe('event-1 event-2', function (e, data) {
                eventName = e.name;
                eventData = data;
            });

            channel.publish('event-1', 'myData-1');
            expect(eventName).toEqual('event-1');
            expect(eventData).toEqual('myData-1');

            channel.publish('event-2', 'myData-2');
            expect(eventName).toEqual('event-2');
            expect(eventData).toEqual('myData-2');
        });


        it("ONCE subscribe to one channel and publish to one channel", function () {
            var eventName = null,
                eventData = null;

            channel.one('event', function (e, data) {
                eventName = e.name;
                eventData = data;
            });

            channel.publish('event', 'myData');
            expect(eventName).toEqual('event');
            expect(eventData).toEqual('myData');

            channel.publish('event', 'myData-2');
            expect(eventName).toEqual('event');
            expect(eventData).toEqual('myData');
        });


        it("ONCE subscribe to several channels and publish to several channels", function () {
            var eventName = null,
                eventData = null;

            channel.one('event-1 event-2', function (e, data) {
                eventName = e.name;
                eventData = data;
            });

            channel.publish('event-1', 'myData-1');
            expect(eventName).toEqual('event-1');
            expect(eventData).toEqual('myData-1');

            channel.publish('event-1', 'myData-11');
            expect(eventName).toEqual('event-1');
            expect(eventData).toEqual('myData-1');

            channel.publish('event-2', 'myData-2');
            expect(eventName).toEqual('event-2');
            expect(eventData).toEqual('myData-2');

            channel.publish('event-2', 'myData-21');
            expect(eventName).toEqual('event-2');
            expect(eventData).toEqual('myData-2');
        });

        it("check order publications for handlers in one channel", function () {
            var eventsOrder = [];

            channel.subscribe('event-1', function (e, data) {
                eventsOrder.push(1);
            });

            channel.subscribe('event-1', function (e, data) {
                eventsOrder.push(2);
            });

            channel.subscribe('event-1', function (e, data) {
                eventsOrder.push(3);
            });

            channel.subscribe('event-1', function (e, data) {
                eventsOrder.push(4);
            });

            channel.publish('event-1');

            expect(eventsOrder[0]).toEqual(1);
            expect(eventsOrder[1]).toEqual(2);
            expect(eventsOrder[2]).toEqual(3);
            expect(eventsOrder[3]).toEqual(4);
        });
    });



    describe('Unsubscribe', function () {

        it("unsubscribe from one channel by channel name", function () {
            var eventName = null,
                eventData = null,
                eventName2 = null,
                eventData2 = null;

            channel.subscribe('event', function (e, data) {
                eventName = e.name;
                eventData = data;
            });

            channel.subscribe('event', function (e, data) {
                eventName2 = e.name;
                eventData2 = data;
            });

            channel.publish('event', 'myData');
            expect(eventName).toEqual('event');
            expect(eventData).toEqual('myData');
            expect(eventName2).toEqual('event');
            expect(eventData2).toEqual('myData');

            channel.unsubscribe('event');

            // All subscribers must be unsubscribe
            channel.publish('event', 'myData2');
            expect(eventName).toEqual('event');
            expect(eventData).toEqual('myData');
            expect(eventName2).toEqual('event');
            expect(eventData2).toEqual('myData');
        });

        it("unsubscribe from one channel by channel name and callback reference", function () {
            var eventName = null,
                eventData = null,
                eventName2 = null,
                eventData2 = null;

            function callback (e, data) {
                eventName = e.name;
                eventData = data;
            }

            channel.subscribe('event', callback);

            channel.subscribe('event', function (e, data) {
                eventName2 = e.name;
                eventData2 = data;
            });

            channel.publish('event', 'myData');
            expect(eventName).toEqual('event');
            expect(eventData).toEqual('myData');
            expect(eventName2).toEqual('event');
            expect(eventData2).toEqual('myData');

            channel.unsubscribe('event', callback);

            // Only subscriber with callback must be unsubscribe
            channel.publish('event', 'myData2');
            expect(eventName).toEqual('event');
            expect(eventData).toEqual('myData');
            expect(eventName2).toEqual('event');
            expect(eventData2).toEqual('myData2');
        });

        it("unsubscribe from several channels by channels name", function () {
            var events = {};

            channel.subscribe('event-1 event-2 event-3', function (e, data) {
                events[e.name] = data;
            });

            channel.publish('event-1 event-2 event-3', 'myData');
            expect(events['event-1']).toEqual('myData');
            expect(events['event-2']).toEqual('myData');
            expect(events['event-3']).toEqual('myData');

            channel.unsubscribe('event-1 event-2');

            // All subscribers must be unsubscribe, except for "event-3"
            channel.publish('event-1 event-2 event-3', 'myData2');
            expect(events['event-1']).toEqual('myData');
            expect(events['event-2']).toEqual('myData');
            expect(events['event-3']).toEqual('myData2');
        });

        it("unsubscribe from several channels by channels name and callback reference", function () {
            var events = {};

            function callback (e, data) {
                events[e.name] = data;
            }

            channel.subscribe('event-1 event-2', callback);

            channel.subscribe('event-2', function (e, data) {
                events['event-2a'] = data;
            });


            channel.publish('event-1 event-2', 'myData');
            expect(events['event-1']).toEqual('myData');
            expect(events['event-2']).toEqual('myData');
            expect(events['event-2a']).toEqual('myData');

            channel.unsubscribe('event-1 event-2', callback);

            // All subscribers must be unsubscribe, except for "event-2" with another callback
            channel.publish('event-1 event-2', 'myData2');
            expect(events['event-1']).toEqual('myData');
            expect(events['event-2']).toEqual('myData');
            expect(events['event-2a']).toEqual('myData2');
        });
    });



    describe('ONCE Unsubscribe', function () {

        it("ONCE unsubscribe from one channel by channel name", function () {
            var eventName = 'notName',
                eventData = 'notData',
                eventName2 = 'notName',
                eventData2 = 'notData';

            channel.one('event', function (e, data) {
                eventName = e.name;
                eventData = data;
            });

            channel.one('event', function (e, data) {
                eventName2 = e.name;
                eventData2 = data;
            });

            channel.unsubscribe('event');

            channel.publish('event', 'myData');

            expect(eventName).toEqual('notName');
            expect(eventData).toEqual('notData');
            expect(eventName2).toEqual('notName');
            expect(eventData2).toEqual('notData');
        });

        it("ONCE unsubscribe from one channel by channel name and callback reference", function () {
            var eventName = 'notName',
                eventData = 'notData',
                eventName2 = 'notName',
                eventData2 = 'notData';

            function callback (e, data) {
                eventName = e.name;
                eventData = data;
            }

            channel.one('event', callback);

            channel.one('event', function (e, data) {
                eventName2 = e.name;
                eventData2 = data;
            });

            channel.unsubscribe('event', callback);
            channel.publish('event', 'myData');
            expect(eventName).toEqual('notName');
            expect(eventData).toEqual('notData');
            expect(eventName2).toEqual('event');
            expect(eventData2).toEqual('myData');
        });

        it("ONCE unsubscribe from several channels by channels name", function () {
            var events = {};

            events['event-1'] = 'notData';
            events['event-2'] = 'notData';
            events['event-3'] = 'notData';

            channel.one('event-1 event-2 event-3', function (e, data) {
                events[e.name] = data;
            });

            channel.unsubscribe('event-1 event-2');
            channel.publish('event-1 event-2 event-3', 'myData');
            expect(events['event-1']).toEqual('notData');
            expect(events['event-2']).toEqual('notData');
            expect(events['event-3']).toEqual('myData');
        });

        it("ONCE unsubscribe from several channels by channels name and callback reference", function () {
            var events = {};

            events['event-1'] = 'notData';
            events['event-2'] = 'notData';
            events['event-3'] = 'notData';

            function callback (e, data) {
                events[e.name] = data;
            }

            channel.subscribe('event-1 event-2', callback);

            channel.subscribe('event-2', function (e, data) {
                events['event-2a'] = data;
            });


            channel.unsubscribe('event-1 event-2', callback);
            channel.publish('event-1 event-2', 'myData');
            expect(events['event-1']).toEqual('notData');
            expect(events['event-2']).toEqual('notData');
            expect(events['event-2a']).toEqual('myData');
        });
    });
});