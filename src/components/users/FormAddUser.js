import React from 'react';
import { withFirebase } from '../Firebase/context';
import Swal from 'sweetalert2';

class FormAddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      errors: [],
      image: '',
      arrClass: ['PNV20A', 'PNV20B', 'PNV19A', 'PNV19B', 'PNV21A', 'PNV21B']
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  checkError = () => {
    const { name, age, phone, classes, errors } = this.state;
    const user = this.props.users;

    user.map(item => {
      if (name === item.name && phone === item.phone) {
        errors.push(name + ' - ' + phone + '  is exists!!');
      }
    });
    if (!name) {
      errors.push('Name is empty!!');
    }
    if (!age) {
      errors.push('Age is empty!!');
    }
    if (age < 18 || age > 100) {
      errors.push('Age is incorrect !!');
    }
    if (!phone) {
      errors.push('Phone is empty!!');
    }
    if (phone.length !== 10) {
      errors.push('Phone must have 10 letters!!');
    }
    if (!classes) {
      errors.push('Class is empty!!');
    }

    if (errors.length > 0) {
      this.setState({ errors });
      return 0;
    }
    return 1;
  };
  addUser = event => {
    event.preventDefault();
    if (this.checkError()) {
      this.handleUpload();
      Swal.fire({
        title: 'Success',
        text: 'Do you want to continue',
        type: 'success'
      });
    }
  };

  handleChange = event => {
    if (event.target.value) {
      this.setState({
        errors: []
      });
    }
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleImage = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(() => ({ image }));
    }
  };

  handleUpload = () => {
    const { image } = this.state;
    console.log('ima', image);
    const uploadTask = this.props.firebase.storage
      .ref(`images/${image.name}`)
      .put(image);
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress });
      },
      error => {
        console.log(error);
      },
      () => {
        this.props.firebase.storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            this.props.addUser({
              ...this.state,
              image: url
            });
          });
      }
    );
  };

  render() {
    const { name, age, image, classes, phone, errors } = this.state;
    //let { show } = this.state;
    return (
      <div id="page-wrapper">
        <div className="container-fluid">
          <div className="row bg-title">
            <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
              <h4 className="page-title">User Table</h4>{' '}
            </div>
            <div className="col-lg-9 col-sm-8 col-md-8 col-xs-12"> </div>
          </div>
          <div className="white-box">
            <form className="form-horizontal form-material">
              {errors
                ? errors.map((error, index) => (
                    <p key={index}>
                      <span className="label label-danger" key={error}>
                        Error: {error}
                      </span>
                    </p>
                  ))
                : ''}
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">NAME</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter User's Name"
                  name="name"
                  defaultValue={name}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">AGE</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter User's Age"
                  name="age"
                  defaultValue={age}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">PHONE</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter User's Phone"
                  name="phone"
                  defaultValue={phone}
                  onChange={this.handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="exampleFormControlSelect1">CLASS</label>
                <select
                  className="form-control"
                  id="exampleFormControlSelect1"
                  placeholder="Enter User's Class"
                  name="classes"
                  defaultValue={classes}
                  onChange={this.handleChange}
                >
                  {this.state.arrClass.map((item, index) => (
                    <option key={index}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="exampleInputPassword1">IMAGE</label>
                <input
                  type="file"
                  className="form-control-file"
                  name="image"
                  defaultValue={image}
                  onChange={this.handleImage}
                />
              </div>
              <div className="form-group">
                <div className="col-sm-12">
                  <button
                    type="button"
                    className="btn btn-success buttonDF "
                    onClick={this.addUser}
                  >
                    ADD
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <footer className="footer text-center">
          {' '}
          thuongthuy@gmail.com || (+84) 856 244 358{' '}
        </footer>
      </div>
    );
  }
}

export default withFirebase(FormAddUser);
