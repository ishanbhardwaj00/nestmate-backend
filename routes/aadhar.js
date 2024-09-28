
// const cli_id = '3f94a27f-fc95-45d8-bc20-d4da5f5d7331'
// const cli_sec = 'ag9TngY8kxdxfMZwq3sFrOPoFHVyma2b'
// const prod_id = '20c6cfbb-2cc3-4e26-b2b7-4638a3b7ddac'
// // const captha = '2GAD0'
// const adhr_num = 123456
// const otp = 123456
// const shareCode = 1234

// app.get('/test-axios', async (req, res) => {
//   try {
//     // First request to get the `id`
//     const options1 = {
//       method: 'post',
//       url: 'https://dg-sandbox.setu.co/api/okyc',
//       headers: {
//         'x-client-id': cli_id,
//         'x-client-secret': cli_sec,
//         'x-product-instance-id': prod_id,
//       },
//       data: { redirectURL: 'https://setu.co' },
//     }

//     const response1 = await axios.request(options1)

//     // Extract the `id` from the first response
//     const st_id1 = response1.data.id
//     console.log('ID from first request:', id)

//     // Now make the second request using the extracted `id`
//     const options2 = {
//       method: 'get',
//       url: `https://dg-sandbox.setu.co/api/okyc/${st_id1}/initiate`,
//       headers: {
//         'x-client-id': cli_id,
//         'x-client-secret': cli_sec,
//         'x-product-instance-id': prod_id,
//         'Content-Type': 'application/json',
//       },
//     }

//     const response2 = await axios.request(options2)

//     // Log the second response
//     console.log('Response from second request:', response2.data)

//     const reqId = response2.data.id

//     const captha_img = response2.data.captchaImage

//     // Send the combined result to the client
//     res.json({
//       firstRequest: response1.data,
//       requestId: reqId,

//       captha_image: captha_img,
//     })
//   } catch (error) {
//     console.error(error)
//     res.status(500).send('Error occurred while making the requests')
//   }
// })