const amqp = require("amqp-connection-manager");
const exchangeName = "testexchange";
const queueName = "test-queue";
const routingKey = "test-queue";
// 创建连接管理器
const connection = amqp.connect({
  hostname: "192.168.5.9",
  port: 5672,
  username: "wisdom",
  password: "wisdom0826",
});

const channelWrapper = connection.createChannel({
  json: true,
  setup: function (channel) {
    return Promise.all([
      channel.assertExchange(exchangeName, "direct", {
        durable: true,
      }),
      channel.assertQueue(queueName, {
        exclusive: false,
        durable: true,
        autoDelete: false,
        arguments: {
          "x-queue-type": "stream",
          "x-max-length-bytes": 2_000_000_000,
        },
      }),
      channel.bindQueue(queueName, exchangeName, routingKey),
    ]);
  },
});

// 发送数据

for (let index = 0; index < 10; index++) {
  channelWrapper.publish(exchangeName, routingKey, { index });
}
