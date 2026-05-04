package org.sid.ebankingbackend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.sid.ebankingbackend.enums.AccountStatus;
import java.util.Date;
import java.util.List;
@Entity
//dans la classe principale bankAcount
//single_table, per_class_table, joined
@Inheritance(strategy = InheritanceType.SINGLE_TABLE) //pour la strategie utilisee pour mapping hereitage;
//cela just pour single_table;
@DiscriminatorColumn(name = "TYPE", length = 4)
@Data @NoArgsConstructor @AllArgsConstructor
public class BankAccount {
    @Id
    private String id;
    private  double balance;
    private Date createdAt;
    @Enumerated(EnumType.STRING) //cela pour les enumarteur qui declaree apres dans enum on format string;
    private AccountStatus status;
    @ManyToOne
    private Customer customer;
    @OneToMany(mappedBy = "bankAccount", fetch = FetchType.LAZY) //lazy or eager
    private List<AccountOperation> accountOperations;

}
