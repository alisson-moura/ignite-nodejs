import { UniqueEntityId } from './unique-entity-id';

export class Entity<Props> {
  private readonly _id: UniqueEntityId;
  protected props: Props;

  protected constructor(props: Props, id?: UniqueEntityId) {
    this.props = props;
    this._id = id ?? new UniqueEntityId(id);
  }

  get id(): UniqueEntityId {
    return this._id;
  }

  equals(entity: Entity<any>): boolean {
    if (entity == this)
      return true

    if (entity.id === this._id)
      return true
    
    return false
  }
}
