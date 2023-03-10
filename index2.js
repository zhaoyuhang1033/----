const amqp = require("amqp-connection-manager");
// 创建连接管理器
const connection = amqp.connect({
  hostname: "192.168.5.9",
  port: 5672,
  username: "wisdom",
  password: "wisdom0826",
});
// 创建通道
const channelWrapper = connection.createChannel({
  json: true,
});

// 定义队列名称
const queueName = "test_queue";

// 处理队列中的消息
function handleMessages(message) {
  console.log("Received message:", message.content.toString());
  channelWrapper.ack(message);
}

// 订阅队列并处理消息
async function subscribeToQueue() {
  // 声明队列
  await channelWrapper.addSetup((channel) => {
    channel.prefetch(1)
    return channel.assertQueue(queueName, {
      durable: true
    });
  });

  // 订阅队列并处理消息
  await channelWrapper.addSetup((channel) => {
    return channel.consume(queueName, handleMessages);
  });
}

// 订阅队列并处理消息
subscribeToQueue()
  .then(() => {
    console.log("Subscribed to queue successfully!");
  })
  .catch((err) => {
    console.error("Error subscribing to queue:", err);
  });
