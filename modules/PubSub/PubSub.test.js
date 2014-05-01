describe('PubSub', function () {
    var channel;

    beforeEach(function() {
        channel = new PubSub();
    });

    it('subscribe and publish: one channel', function () {
        channel.subscribe('event-1', function (e, data) {
            expect(data).toEqual('myData');
            expect(e.name).toEqual('event-1');
        });

        channel.publish('event-1', 'myData');
    });

    it('subscribe and publish: two channel', function () {
        channel.subscribe('event-21 event-22', function (e, data) {
            expect(data).toEqual('myData');
        });

        channel.publish('event-21', 'myData');
        channel.publish('event-22', 'myData');
    });
});