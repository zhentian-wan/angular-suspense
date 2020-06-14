import { TestBed, fakeAsync, tick } from "@angular/core/testing";

import { LoadingSkeletonService } from "./loading-skeleton.service";
import { LOADING_CONFIG_TOKEN } from "./loading-skeleton.config";

import { of } from "rxjs";
import { delay, take } from "rxjs/operators";

describe("LoadingSkeletonService", () => {
  let service: LoadingSkeletonService;

  beforeEach(() => {
    const mockConfigToken = {
      showContent: false,
      theme: {
        light: {
          backgroundColor: "grey",
          fontColor: "grey",
        },
        dark: {
          backgroundColor: "black",
          fontColor: "black",
        },
      },
    };

    TestBed.configureTestingModule({
      providers: [
        LoadingSkeletonService,
        { provide: LOADING_CONFIG_TOKEN, useValue: mockConfigToken },
      ],
    });
    service = TestBed.inject(LoadingSkeletonService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
