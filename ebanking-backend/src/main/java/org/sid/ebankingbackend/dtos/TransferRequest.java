package org.sid.ebankingbackend.dtos;

import lombok.Data;

@Data
public class TransferRequest {
    private String accountSource;
    private String accountDestination;
    private double amount;
}
