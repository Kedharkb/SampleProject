/* AES Encryption Service utility to encrypt plain text
 *
 * Mode : CFB
 * Padding : Zero Padding
 *
 * key : 16 Bits alphanumeric string
 * IV : 16 Bits alphanumeric string
 * msg : Plain Text (Ensure is greater than 16 bits)
 *
 * @Dependencies :
 * core.js
 * aes.js
 * mode-cfb.min.js
 * pad-zeropadding.js
 * enc-utf8.js
 * */
var app = angular.module('nextGen');
app.service('angularCryptoSerivces', function () {
    this.encrypt = function (key, iv, msg) {

        var key = CryptoJS.enc.Utf8.parse(key);
        var iv = CryptoJS.enc.Utf8.parse(iv);
        var msg = CryptoJS.enc.Utf8.parse(msg)

        return CryptoJS.AES.encrypt(msg, key, {
            iv: iv,
            mode: CryptoJS.mode.CFB,
            padding: CryptoJS.pad.ZeroPadding,
            asBytes: true
        }).ciphertext.toString()
    }

    //
    // this.encryptCredentials = function (key, iv,credentials) {
    //     var text = "";
    //     var len = 16
    //     var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    //
    //
    //     for (var i = 0; i < len; i++){
    //         text += charset.charAt(Math.floor(Math.random() * charset.length));
    //     }
    //
    //     credentials.userName = this.encrypt(key,iv,credentials.userName+'|'+text)
    //     credentials.password = this.encrypt(text,iv,credentials.password+'/<=%+,?->/')
    //     if('oldpassword' in credentials){
    //         console.log('hey this')
    //     }
    //     return credentials
    // }
    // TODO implement decrypt function.
});