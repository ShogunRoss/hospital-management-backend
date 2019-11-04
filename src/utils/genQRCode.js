import qrcode from 'qrcode';
import path from 'path';

export default text => {
  const filename = `qrcode_${Date.now()}_${text}.png`;
  qrcode.toFile(
    path.join('./assets/qrcodes', filename),
    text,
    {
      margin: 2,
      errorCorrectionLevel: 'H',
    },
    err => {
      if (err) throw err;
    }
  );
  return `${process.env.FRONTEND_URL}/qrcodes/${filename}`;
};
