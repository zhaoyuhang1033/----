const amqp = require('amqp-connection-manager');
const streamPlugin = require('amqp-0-9-1-stream');

// 创建连接管理器
const connection = amqp.connect(['amqp://localhost']);
const channelWrapper = connection.createChannel({
  json: true,
  setup: function(channel) {
    // 安装流插件
    return channel.useStreamPublishConfirm(streamPlugin);
  }
});

// 发送数据
const data = 'hello, world';
channelWrapper.publish('my-exchange', 'my-routing-key', data, {
  // 设置持久化选项
  persistent: true,
  // 设置流选项
  mandatory: true,
  confirm: function(err, msg) {
    if (err) {
      console.error(err);
    } else {
      console.log('Message published: ' + JSON.stringify(msg));
    }
  }
});