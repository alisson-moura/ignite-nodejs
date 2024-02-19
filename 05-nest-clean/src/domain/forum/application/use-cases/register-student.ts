import { Either, left, right } from '@/core/either';
import { StudentAlreadyExistsError } from './errors/student-already-exists';
import { Student } from '../../enterprise/entities/student';
import { Injectable } from '@nestjs/common';
import { StudentRepository } from '../repositories/student-repository';
import { HashGenerator } from '../cryptography/hash-generator';

interface RegisterStudentRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentResponse = Either<
  StudentAlreadyExistsError,
  { student: Student }
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentRepository: StudentRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    request: RegisterStudentRequest,
  ): Promise<RegisterStudentResponse> {
    const { email, name, password: plainPassword } = request;

    const studentWithSameEmail =
      await this.studentRepository.findByEmail(email);
    if (studentWithSameEmail != null) {
      return left(new StudentAlreadyExistsError(email));
    }

    const password = await this.hashGenerator.hash(plainPassword);
    const student = Student.create({ name, email, password });

    await this.studentRepository.create(student);
    return right({ student });
  }
}
