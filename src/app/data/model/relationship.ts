export class Relationship {
  public _id: string;
  public category: string;
  public requester: any;
  public receiver: any;
  public recommander: string;
  public status: string;
  public creationDate: string;
  public modificationDate: string;
  public modificationAuthor: string;
  constructor(requester: string, receiver: string) {
    this.category = "DIRECT";
    this.status = "PENDING";
    this.requester = requester;
    this.receiver = receiver;
    this.modificationAuthor = requester;
  }
}

export class ComplementaryData {
  public requesterPseudo: string;
  public receiverPseudo: string;
  public receiverEmail: string;
  constructor(requesterPseudo: string, receiverPseudo: string, email: string) {
    this.requesterPseudo = requesterPseudo;
    this.receiverPseudo = receiverPseudo;
    this.receiverEmail = email;
  }
}

export class RelationForm {
  relation: Relationship;
  complementaryData: ComplementaryData;
  constructor(relation: Relationship, complementary: ComplementaryData) {
    this.relation = relation;
    this.complementaryData = complementary;
  }
}
