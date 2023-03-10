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

// 创建队列并发送消息
async function createQueueAndSendMessage() {
  // 声明队列
  await channelWrapper.addSetup((channel) => {
    return channel.assertQueue(queueName, {
      durable: true,
    });
  });

  // 发送消息
  for (let index = 0; index < 10; index++) {
    const element = index;
    channelWrapper.sendToQueue(queueName, { element });
  }
}

// 发送消息
createQueueAndSendMessage()
  .then(() => {
    console.log("Message sent successfully!");
  })
  .catch((err) => {
    console.error("Error sending message:", err);
  });
