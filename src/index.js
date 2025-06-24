const express = require('express');
const app = express();

app.use(express.json());

const userRoutes = require('./routes/user_routes');
app.use('/users', userRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
  

// const express = require('express');
// const { act } = require('react');
// const app = express();

// app.use(express.json()); // to parse JSON in POST/PUT

// // Sample in-memory users
// let users = [
//   User(1, "Nayan", true),
//   User(2, "Gopal", false),
// ];

// // GET all users
// app.get('/users', (req, res) => {
//   res.json(users);
// });

// // GET user by ID
// app.get('/users/:id', (req, res) => {
//   const user = users.find(u => u.id == req.params.id);
//   let isUserFound = user != null;
//   if(isUserFound){
//   let resJson = apiResponse(true, 'Data fetch succees')
//   res.json(resJson);
// } else {
// let resJson = apiResponse(false, "User not found", null, {
//   'error': 'User not found',
// })
// res.json(res.json);
// }
// });

// app.get('/allActiveUsers', (req, res) => {
//   const activeUsers = users.where(e => e.active);
//   res.status(200).json({
//     'status': true,
//     'message': "Active users fetch successfully",
//     "data": activeUsers,
//   })
// })

// // POST add new user
// app.post('/users', (req, res) => {
//   const newUser = {
//     id: users.length + 1,
//     name: req.body.name,
//     active: true,
//   };
//   users.push(newUser);
//   res.status(201).json(newUser);
// });


// // PUT update user
// app.put('/users/:id', (req, res) => {
//   const user = users.find(u => u.id == req.params.id);
//   if (!user) return res.status(404).send('User not found');

//   user.name = req.body.name;
//   res.json(user);
// });


// // PUT update user
// app.put('/users/toggle_active/:id', (req, res) => {
//   const user = users.find(u => u.id == req.params.id);
//   if (!user) return res.status(404).send('User not found');

//   user.active = req.body.active ?? !(user.active);
//   res.json(user);
// });

// // DELETE user
// app.delete('/users/:id', (req, res) => {
//   users = users.filter(u => u.id != req.params.id);
//   res.send('User deleted');
// });

// // Start server
// const PORT = 3000;
// app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
