import * as auth from 'express-basic-auth';
import * as loki from 'lokijs';
import * as express from 'express';
import { NOT_FOUND, BAD_REQUEST, UNAUTHORIZED, OK } from 'http-status-codes';       //for Error handling

let app = express();
app.use(express.json());


const port: number = 8090;
app.listen(port, function () {
    console.log('API is listening on port ' + port)
});

let authentification = auth({
    users: {
        'admin': 'admin'
    }
})


//Database: initialization & creating a 'guest' collection for saving them
const db = new loki(__dirname + '/db.dat');
let guestC = db.addCollection('guests');


//get-request to get party title, location and date:
app.get('/party', function (req, res) {
    res.send({
        title: 'Birthday Party',
        date: '31.03.2019',
        location: 'My place'
    }
    );

})

//post-request for registering the guests:
let firstname: string;
let lastname: string;

app.post('/register', function (req, res) {
    firstname = req.body.firstName;
    lastname = req.body.lastName;

    if (firstname == '' || lastname == '') {
        res.status(BAD_REQUEST).send('Please fill in the whole name!');
    } else {

        if (guestC.data.length <= 10) {
            guestC.insert({ fistName: firstname, lastName: lastname });
            res.status(OK).send('Guest added!');
        } else {
            res.status(BAD_REQUEST).send('Sorry, the maximum number of guests has already been reached!');
        }

    }
})

//request a list of registered guests
app.get('/guests', authentification, function (req, res) {
    let help:string;
    if (!res.send(guestC.find())) {
        res.status(NOT_FOUND).send('No guests found!');
    } else {
        res.send(guestC.find());

        for(let i=0; i<guestC.data.length;i++ ){
            help= guestC.get(i);
            res.send(guestC.find( {'name': help} ));
        }
    }
})










