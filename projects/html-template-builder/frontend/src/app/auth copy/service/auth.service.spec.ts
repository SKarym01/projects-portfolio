// Importing TestBed utility to configure the testing environment
import { TestBed } from '@angular/core/testing';

// Importing the AuthService that will be tested
import { AuthService } from './auth.service';

// Test suite for AuthService
describe('AuthService', () => {
  let service: AuthService; // Variable to store the injected instance of AuthService

  // This block runs before each individual test
  beforeEach(() => {
    // Configures the testing environment for the service
    TestBed.configureTestingModule({});
    // Injects an instance of AuthService into the test
    service = TestBed.inject(AuthService);
  });

  // A simple test case to verify that the service instance is successfully created
  it('should be created', () => {
    // Expect the service to be truthy (i.e., not null or undefined)
    expect(service).toBeTruthy();
  });
});
