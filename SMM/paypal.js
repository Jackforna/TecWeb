/*

let costo;
let plusday;
let plusweek;
let plusmonth;
let version;
const user = JSON.parse(localStorage.getItem("actualuser"));

document.getElementById("proversion1").addEventListener("click", ()=>{
    document.getElementById("upgrade_proversion").style = "display:none";
    document.getElementById("datipaypal").style = "display:inline";
    costo = 11.99;
    plusday = 300;
    plusweek = 2000;
    plusmonth = 7000;
    version = "proversion";
});

document.getElementById("proversion2").addEventListener("click", ()=>{
    document.getElementById("upgrade_proversion").style = "display:none";
    document.getElementById("datipaypal").style = "display:inline";
    costo = 19.99;
    plusday = 550;
    plusweek = 3500;
    plusmonth = 12000;
    version = "proversion+";
});

const paypalButtonsComponent = paypal.Buttons({
    // optional styling for buttons
    // https://developer.paypal.com/docs/checkout/standard/customize/buttons-style-guide/
    style: {
      color: "gold",
      shape: "rect",
      layout: "vertical"
    },

    // set up the transaction
    createOrder: (data, actions) => {
        // pass in any options from the v2 orders create call:
        // https://developer.paypal.com/api/orders/v2/#orders-create-request-body
        const createOrderPayload = {
            purchase_units: [
                {
                    amount: {
                        value: costo,
                    }
                }
            ]
        };

        return actions.order.create(createOrderPayload);
    },

    // finalize the transaction
    onApprove: (data, actions) => {
        const captureOrderHandler = (details) => {
            const payerName = details.payer.name.given_name;
            console.log('Transaction completed');
            user.version = version;
            user.char_d += plusday;
            user.char_w += plusweek;
            user.char_m += plusmonth;
            localStorage.setItem("actualuser",user);
            let users = JSON.parse(localStorage.getItem("users"));
            for(i=0;i<users.length;i++){
                if(actualuser.nickname==users[i].nickname){
                    users[i] = actualuser;
                    localStorage.setItem("users",JSON.stringify(users));
            }
        }
        };

        return actions.order.capture().then(captureOrderHandler);
    },

    // handle unrecoverable errors
    onError: (err) => {
        console.error('An error prevented the buyer from checking out with PayPal');
    }
});

paypalButtonsComponent
    .render("#paypal-button-container")
    .catch((err) => {
        console.error('PayPal Buttons failed to render');
});*/