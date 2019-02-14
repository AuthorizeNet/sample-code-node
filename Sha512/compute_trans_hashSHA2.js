var sha512 = require('js-sha512');
var apiLogin ="2Kfn5S7x7D";
var transId ="60115585081";
var amount ='12.00';
var signatureKey = '56E529FE6C63D60E545F84686096E6AA01D5E18A119F18A130F7CFB3983104216979E95D84C91BDD382AA0875264A63940A2D0AA5548F6023B4C78A9D52C18DA';
var textToHash = "^" + apiLogin + "^" + transId + "^" + amount + "^";

function generateSHA512(textToHash, signatureKey)
{
    if (textToHash != null && signatureKey != null) {
                    var sig = sha512.hmac(Buffer.from(signatureKey, 'hex'), textToHash).toUpperCase();
                    console.log("Computed SHA512 Hash: " + sig + "\n");
                } else {
                    console.log("Either Signature key or the text to hash is empty \n");
                }
}

generateSHa512(textToHash, signatureKey);
