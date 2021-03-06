const { v1: uuidv1 } = require('uuid');
const crypto = require('crypto');
const https = require('https');

/*
var PORT = process.env.PORT || 5000;

app.listen(PORT, function() {
    console.log('Server is listening');
});*/

var partnerCode = "MOMOP66L20211116"
var accessKey = "cjSrgaGDgWc0r1Df"
var serectkey = "nP7JGqJ5TE0gTKtVT3GIma8JsNhrgQvq"
var orderInfo = "Donate Elite"
var notifyurl = "https://callback.url/notify"
var requestType = "captureMoMoWallet"
var extraData = "merchantName=;merchantId="

function momoPayment(protocol, host, amount, response) {
    var returnUrl = protocol + "://" + host + "/post_momo";
    var orderId = uuidv1();
    var requestId = uuidv1();
    var rawSignature = "partnerCode=" + partnerCode + "&accessKey=" + accessKey + "&requestId=" + requestId + "&amount=" + amount + 
    "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&returnUrl=" + returnUrl + "&notifyUrl=" + notifyurl + "&extraData=" + extraData
    
    var signature = crypto.createHmac('sha256', serectkey)
    .update(rawSignature)
    .digest('hex');

    var body = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount.toString(),
        orderId: orderId,
        orderInfo: orderInfo,
        returnUrl: returnUrl,
        notifyUrl: notifyurl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
    });

    var options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/gw_payment/transactionProcessor',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
            'Access-Control-Allow-Origin': 'payment.momo.vn'
        }
    };

    var req = https.request(options, (res) => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (body) => {
            console.log('Body');
            console.log(body);
            console.log('payURL');
            console.log((JSON.parse(body).payUrl));
            var a = JSON.parse(body).payUrl;
            console.log(String(a));
            response.send({
                succ: true,
                link: a,
            });
        });
    
        // res.on('end', () => {
        //     console.log('No more data in response.');
        // });
    });
    req.write(body);
    req.end();
}

module.exports = momoPayment;