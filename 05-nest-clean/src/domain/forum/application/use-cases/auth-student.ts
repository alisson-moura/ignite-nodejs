import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { StudentRepository } from '../repositories/student-repository';
import { WrongCredentialsError } from './errors/wrong-credentials-error.ts';
import { Encrypter } from '../cryptography/encrypter';
import { HashComparer } from '../cryptography/hash-comparer';

interface AuthStudentRequest {
  email: string;
  password: string;
}

type AuthStudentResponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>;

@Injectable()
export class AuthStudentUseCase {
  constructor(
    private studentRepository: StudentRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute(request: AuthStudentRequest): Promise<AuthStudentResponse> {
    const { email, password: plainPassword } = request;

    const student = await this.studentRepository.findByEmail(email);
    if (student == null) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      plainPassword,
      student.password,
    );
    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    });

    return right({ accessToken });
  }
}
