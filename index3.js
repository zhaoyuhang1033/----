const amqp = require("amqplib");

const QUEUE_NAME = "my-test-queue";

async function main() {
  const conn = await amqp.connect({
    hostname: "192.168.5.9",
    port: 5672,
    username: "wisdom",
    password: "wisdom0826",
  });
  const channel = await conn.createChannel();

  await channel.assertQueue(QUEUE_NAME);

  // 启动三个消费者

  channel.consume(
    QUEUE_NAME,
    (msg) => {
      if (msg) {
        console.log(`Consumer1  received message: ${msg.content.toString()}`);
        // 模拟处理消息需要的时间
        setTimeout(() => {

          channel.ack(msg);
        }, 1000);
      }
    },
    { noAck: false }
  );

}

main().catch(console.error);
