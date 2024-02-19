import { Entity } from '@/core/entities/entity';
import { type UniqueEntityId } from '@/core/entities/unique-entity-id';

interface StudentProps {
  name: string;
  email: string;
  password: string;
}

export class Student extends Entity<StudentProps> {
  static create(props: StudentProps, id?: UniqueEntityId): Student {
    return new Student(props, id);
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }
}
