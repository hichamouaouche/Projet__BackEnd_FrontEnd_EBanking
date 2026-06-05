package org.sid.ebankingbackend.web;

import org.sid.ebankingbackend.dtos.*;
import org.sid.ebankingbackend.exceptions.BalanceNotSufficientException;
import org.sid.ebankingbackend.exceptions.BankAccountNotFoundException;
import org.sid.ebankingbackend.services.BankAccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class BankAccountRestAPI {
    private final BankAccountService bankAccountService;

    public BankAccountRestAPI(BankAccountService bankAccountService) {
        this.bankAccountService = bankAccountService;
    }

    @GetMapping("/accounts/{accountId}")
    public BankAccountDTO getBankAccount(@PathVariable String accountId) throws BankAccountNotFoundException {
        return bankAccountService.getBankAccount(accountId);
    }

    @GetMapping("/accounts")
    public List<BankAccountDTO> listAccounts() {
        return bankAccountService.bankAccountList();
    }

    @GetMapping("/accounts/{accountId}/operations")
    public List<AccountOperationDTO> getHistory(@PathVariable String accountId) {
        return bankAccountService.accountHistory(accountId);
    }

    @GetMapping("/accounts/{accountId}/pageoperations")
    public AccountHistoryDTO getAccountHistory(
            @PathVariable String accountId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size) throws BankAccountNotFoundException {
        return bankAccountService.getAccountHistory(accountId, page, size);
    }

    @PostMapping("/accounts/debit")
    public ResponseEntity<Void> debit(@RequestBody DebitRequest request)
            throws BankAccountNotFoundException, BalanceNotSufficientException {
        bankAccountService.debit(request.getAccountId(), request.getAmount(), request.getDescription());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/accounts/credit")
    public ResponseEntity<Void> credit(@RequestBody CreditRequest request)
            throws BankAccountNotFoundException {
        bankAccountService.credit(request.getAccountId(), request.getAmount(), request.getDescription());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/accounts/transfer")
    public ResponseEntity<Void> transfer(@RequestBody TransferRequest request)
            throws BankAccountNotFoundException, BalanceNotSufficientException {
        bankAccountService.transfer(request.getAccountSource(), request.getAccountDestination(), request.getAmount());
        return ResponseEntity.ok().build();
    }
}
