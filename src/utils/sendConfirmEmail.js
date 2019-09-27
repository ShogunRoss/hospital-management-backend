import SparkPost from 'sparkpost';

const client = new SparkPost(process.env.SPARKPOST_API_KEY);

export default async (recipient, url) => {
  await client.transmissions.send({
    options: {
      sandbox: true,
    },
    content: {
      from: 'testing@sparkpostbox.com',
      subject: 'Hospital Management Confirm Email',
      html: `
        <html>
          <body>
            <p>Testing SparkPost - the world's most awesomest email service!</p>
            <a href="${url}">Confirm Email</a>
          </body>
        </html>
      `,
    },
    recipients: [{ address: recipient }],
  });
};
