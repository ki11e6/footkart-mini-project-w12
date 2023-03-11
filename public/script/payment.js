//  Razorpay

async function Payment(buttonid, discount, offer) {
  const button = document.getElementById(buttonid);
  const address = document.querySelector(
    'input[name = "address"]:checked'
  ).value;
  const url = '/payment/razorpay';
  console.log(discount);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        discount,
        offer,
      }),
    });
    const res = await response.json();
    if (res.successStatus) {
      check(res.orderInstance, res.user);
    } else {
      window.location.href = '/checkout';
    }
  } catch (err) {}
}

function check(order, user) {
  const options = {
    key: 'rzp_test_kMKu0EZeNbI88S',
    // key: process.env.RAZORPAY_key_id,
    amount: order.amount,
    currency: 'INR',
    name: 'FootKart',
    description: 'Test Transaction',
    image: '',
    order_id: order.id,
    handler: function (response) {
      verifyPayment(response, order);
    },
    prefill: {
      name: user.username,
      email: user.email,
      contact: user.number,
    },
    notes: {
      address: 'Razorpay Corporate Office',
    },
    theme: {
      color: '#000000',
    },
    modal: {
      ondismiss: function () {
        cancelPayment(order);
      },
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.on('payment.failed', function (response) {
    paymentFail(response, order);
  });
  rzp1.open();
}

async function verifyPayment(payment, order) {
  const response = await fetch('/payment/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      payment,
      order,
    }),
  });
  const res = await response.json();
  if (res.successStatus) {
    window.location.href = '/payment/cod';
  } else {
    window.location.href = '/paymentfail';
  }
}

async function cancelPayment(order) {
  try {
    const response = await fetch('/payment/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order,
      }),
    });
    const res = await response.json();
    if (res.successStatus) {
      window.location.href = '/paymentfail';
    } else {
      window.location.href = '/';
    }
  } catch (error) {
    console.log(error);
  }
}

async function paymentFail(payment, order) {
  const response = await fetch('/paymentfail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      payment,
      order,
    }),
  });
  const res = await response.json();
  if (res.successStatus) {
    window.location.href = '/paymentfail';
  } else {
    window.location.href = '/paymentfail';
  }
}
