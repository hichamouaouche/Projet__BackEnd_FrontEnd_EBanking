package org.sid.ebankingbackend.dtos;

import lombok.Data;

@Data
public class CreditRequest {
    private String accountId;
    private double amount;
    private String description;
}
