class Developer {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  getName(){
    return `${this.firstName} ${this.lastName}`;
  }
}

export class ReactDeveloper extends Developer {
  getJob() {
    return 'React Developer'
  }
}