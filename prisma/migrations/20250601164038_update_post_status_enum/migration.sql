-- AlterTable
ALTER TABLE `Post` MODIFY `status` ENUM('판매중', '예약중', '거래완료', '대기중') NOT NULL DEFAULT '대기중';
