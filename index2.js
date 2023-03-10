const amqp = require('amqp-connection-manager');
const streamPlugin = require('amqp-0-9-1-stream');

// 创建连接管理器
const connection = amqp.connect(['amqp://localhost']);
const channelWrapper = connection.createChannel({
  json: true,
  setup: function(channel) {
    // 安装流插件
    return channel.useStreamConsumer(streamPlugin);
  }
});

// 接收数据
channelWrapper.addSetup(function(channel) {
  // 订阅队列
  return channel.consume('my-queue', function(msg) {
    console.log('Message received: ' + msg.content.toString());
    channel.ack(msg);
  });
});