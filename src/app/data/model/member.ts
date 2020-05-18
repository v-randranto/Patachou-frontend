export class Member {
  public pseudo: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public sex: string;
  public birthDate: Date;
  public password: string;
  public presentation: string;
  public photo: Photo;
  public creationDate: Date;
}

export class Photo {
  public name: string;
  public contentType: string;
  public content: any;
  constructor(name: string, type: string) {
    this.name = name;
    this.contentType = type;
  }
}

